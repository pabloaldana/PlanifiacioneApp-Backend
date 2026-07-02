import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra, PaymentStatus } from './entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class CompraService {

  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>
  ) { }

  async create(createCompraDto: CreateCompraDto) {
    const { userId, planificacionId, ...rest } = createCompraDto;
    const newCompra = this.compraRepository.create({
      ...rest,
      user: { id: userId },
      planificacion: { id: planificacionId },
    });
    await this.compraRepository.save(newCompra);
    return newCompra;
  }

  async findMyPurchases(user: User) {
    const purchases = await this.compraRepository.find({
      where: { user: { id: user.id }, paymentStatus: PaymentStatus.PAID },
      relations: ['planificacion'],
    });

    return purchases;
  }

  async findAllPurchases() {
    const purchases = await this.compraRepository.find()
    return purchases
  }

  async updatePaymentStatus(transactionId: string, status: 'paid' | 'failed'): Promise<void> {
    await this.compraRepository.update(
      { transactionId },
      { paymentStatus: status as any },
    );
  }

  async updateCompraAfterPayment(compraId: string, transactionId: string, status: 'paid' | 'failed'): Promise<void> {
    await this.compraRepository.update(
      { id: compraId },
      { paymentStatus: status as any, transactionId },
    );
  }

  async findOneWithUser(compraId: string): Promise<Compra | null> {
    return this.compraRepository.findOne({
      where: { id: compraId },
      relations: ['user'],
    });
  }

  async hasPurchased(userId: string, planificacionId: number): Promise<boolean> {
    const compra = await this.compraRepository.findOne({
      where: {
        user: { id: userId },
        planificacion: { id: planificacionId },
        paymentStatus: PaymentStatus.PAID,
      },
    });
    return !!compra;
  }

  async hasPurchases(planificacionId: number): Promise<boolean> {
    const compra = await this.compraRepository.findOne({
      where: { planificacion: { id: planificacionId } },
    });
    return !!compra;
  }

  async getTotalRevenue(): Promise<number> {
    const { total } = await this.compraRepository
      .createQueryBuilder('compra')
      .select('COALESCE(SUM(compra.priceAtPurchase), 0)', 'total')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    return Number(total);
  }

  async getMonthlyRevenue(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { total } = await this.compraRepository
      .createQueryBuilder('compra')
      .select('COALESCE(SUM(compra.priceAtPurchase), 0)', 'total')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('compra.createdAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    return Number(total);
  }

  private sellerBaseQuery(sellerId: string) {
    return this.compraRepository
      .createQueryBuilder('compra')
      .innerJoin('compra.planificacion', 'planificacion')
      .innerJoin('planificacion.user', 'seller')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('seller.id = :sellerId', { sellerId });
  }

  async getRevenueBySeller(sellerId: string): Promise<number> {
    const { total } = await this.sellerBaseQuery(sellerId)
      .select('COALESCE(SUM(compra.priceAtPurchase), 0)', 'total')
      .getRawOne();

    return Number(total);
  }

  async getTotalSpentByUser(userId: string): Promise<number> {
    const { total } = await this.compraRepository
      .createQueryBuilder('compra')
      .innerJoin('compra.user', 'user')
      .select('COALESCE(SUM(compra.priceAtPurchase), 0)', 'total')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('user.id = :userId', { userId })
      .getRawOne();

    return Number(total);
  }

  async getTopSellingByUser(sellerId: string): Promise<{ title: string; ventas: string }[]> {
    const rows = await this.sellerBaseQuery(sellerId)
      .select('planificacion.title', 'title')
      .addSelect('COUNT(compra.id)', 'count')
      .groupBy('planificacion.id')
      .addGroupBy('planificacion.title')
      .orderBy('count', 'DESC')
      .limit(4)
      .getRawMany();

    return rows.map((row) => ({
      title: row.title,
      ventas: `${row.count} ventas`,
    }));
  }

  async getRecentSalesByUser(sellerId: string): Promise<Compra[]> {
    return this.sellerBaseQuery(sellerId)
      .addSelect('planificacion')
      .orderBy('compra.createdAt', 'DESC')
      .limit(5)
      .getMany();
  }

  async getTotalSalesCountBySeller(sellerId: string): Promise<number> {
    const { count } = await this.sellerBaseQuery(sellerId)
      .select('COUNT(compra.id)', 'count')
      .getRawOne();

    return Number(count);
  }

  async getBestSellingByUser(sellerId: string): Promise<{ title: string; ventas: number } | null> {
    const row = await this.sellerBaseQuery(sellerId)
      .select('planificacion.title', 'title')
      .addSelect('COUNT(compra.id)', 'count')
      .groupBy('planificacion.id')
      .addGroupBy('planificacion.title')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    if (!row) return null;

    return {
      title: row.title,
      ventas: Number(row.count),
    };
  }

  async getMonthlyRevenueBySellerForYear(
    sellerId: string,
    year: number,
  ): Promise<{ month: number; monto: number }[]> {
    const rows = await this.sellerBaseQuery(sellerId)
      .select('EXTRACT(MONTH FROM compra.createdAt)', 'month')
      .addSelect('SUM(compra.priceAtPurchase)', 'monto')
      .andWhere('EXTRACT(YEAR FROM compra.createdAt) = :year', { year })
      .groupBy('month')
      .getRawMany();

    return rows.map((row) => ({
      month: Number(row.month),
      monto: Number(row.monto),
    }));
  }

  async getMonthlySalesCountBySellerForYear(
    sellerId: string,
    year: number,
  ): Promise<{ month: number; ventas: number }[]> {
    const rows = await this.sellerBaseQuery(sellerId)
      .select('EXTRACT(MONTH FROM compra.createdAt)', 'month')
      .addSelect('COUNT(compra.id)', 'count')
      .andWhere('EXTRACT(YEAR FROM compra.createdAt) = :year', { year })
      .groupBy('month')
      .getRawMany();

    return rows.map((row) => ({
      month: Number(row.month),
      ventas: Number(row.count),
    }));
  }

  async getSalesBySubjectForSeller(
    sellerId: string,
  ): Promise<{ materia: string; ventas: number }[]> {
    const rows = await this.sellerBaseQuery(sellerId)
      .innerJoin('planificacion.materia', 'materia')
      .select('materia.name', 'materia')
      .addSelect('COUNT(compra.id)', 'count')
      .groupBy('materia.id')
      .addGroupBy('materia.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return rows.map((row) => ({
      materia: row.materia,
      ventas: Number(row.count),
    }));
  }

  async getTopSelling(limit = 3): Promise<
    { id: number; title: string; materia: string; grado: string; price: number; ventas: number }[]
  > {
    const rows = await this.compraRepository
      .createQueryBuilder('compra')
      .innerJoin('compra.planificacion', 'planificacion')
      .innerJoin('planificacion.materia', 'materia')
      .innerJoin('planificacion.grado', 'grado')
      .select('planificacion.id', 'id')
      .addSelect('planificacion.title', 'title')
      .addSelect('materia.name', 'materia')
      .addSelect('grado.name', 'grado')
      .addSelect('planificacion.price', 'price')
      .addSelect('COUNT(compra.id)', 'count')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('planificacion.is_active = true')
      .groupBy('planificacion.id')
      .addGroupBy('planificacion.title')
      .addGroupBy('materia.name')
      .addGroupBy('grado.name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      title: row.title,
      materia: row.materia,
      grado: row.grado,
      price: Number(row.price),
      ventas: Number(row.count),
    }));
  }

  async getSoldPlanificacionesBySeller(sellerId: string): Promise<
    { title: string; materia: string; grado: string; ventas: number; ingresos: number }[]
  > {
    const rows = await this.sellerBaseQuery(sellerId)
      .innerJoin('planificacion.materia', 'materia')
      .innerJoin('planificacion.grado', 'grado')
      .select('planificacion.title', 'title')
      .addSelect('materia.name', 'materia')
      .addSelect('grado.name', 'grado')
      .addSelect('COUNT(compra.id)', 'count')
      .addSelect('SUM(compra.priceAtPurchase)', 'ingresos')
      .groupBy('planificacion.id')
      .addGroupBy('planificacion.title')
      .addGroupBy('materia.name')
      .addGroupBy('grado.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return rows.map((row) => ({
      title: row.title,
      materia: row.materia,
      grado: row.grado,
      ventas: Number(row.count),
      ingresos: Number(row.ingresos),
    }));
  }
}
