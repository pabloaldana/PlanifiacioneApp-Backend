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
    const newCompra = this.compraRepository.create(createCompraDto)
    await this.compraRepository.save(newCompra)
    return newCompra
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
}
