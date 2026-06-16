import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
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
      where: { user: { id: user.id } },
      relations: ['planificacion'], // opcional si querés traer info relacionada
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
}
