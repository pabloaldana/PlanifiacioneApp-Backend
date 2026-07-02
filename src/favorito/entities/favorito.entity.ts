import { User } from 'src/auth/entities/auth.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('favoritos')
@Unique(['user', 'planificacion'])
export class Favorito {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
    user!: User;

    @ManyToOne(() => Planificacion, { onDelete: 'CASCADE', eager: false })
    planificacion!: Planificacion;

    @CreateDateColumn()
    createdAt!: Date;
}
