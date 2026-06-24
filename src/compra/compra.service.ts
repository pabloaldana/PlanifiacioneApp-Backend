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

  async getRevenueBySeller(sellerId: string): Promise<number> {
    const { total } = await this.compraRepository
      .createQueryBuilder('compra')
      .innerJoin('compra.planificacion', 'planificacion')
      .innerJoin('planificacion.user', 'seller')
      .select('COALESCE(SUM(compra.priceAtPurchase), 0)', 'total')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('seller.id = :sellerId', { sellerId })
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
    const rows = await this.compraRepository
      .createQueryBuilder('compra')
      .innerJoin('compra.planificacion', 'planificacion')
      .innerJoin('planificacion.user', 'seller')
      .select('planificacion.title', 'title')
      .addSelect('COUNT(compra.id)', 'count')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('seller.id = :sellerId', { sellerId })
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
    const sales = await this.compraRepository
      .createQueryBuilder('compra')
      .innerJoinAndSelect('compra.planificacion', 'planificacion')
      .innerJoin('planificacion.user', 'seller')
      .where('compra.paymentStatus = :status', { status: PaymentStatus.PAID })
      .andWhere('seller.id = :sellerId', { sellerId })
      .orderBy('compra.createdAt', 'DESC')
      .limit(5)
      .getMany();

    return sales;
  }
}
