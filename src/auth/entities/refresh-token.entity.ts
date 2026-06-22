import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './auth.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column('varchar')
  tokenHash!: string;

  @Column('timestamp')
  expiresAt!: Date;

  @Column('boolean', { default: false })
  revoked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
