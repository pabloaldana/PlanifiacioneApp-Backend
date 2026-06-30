import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Planificacion } from "src/planificacion/entities/planificacion.entity";

@Entity('planificacion_imagenes')
export class PlanificacionImagen {

    @PrimaryGeneratedColumn()
    id!: number

    @Column('text')
    url!: string // secure_url de Cloudinary, publica

    @Column('text')
    public_id!: string // para poder borrarla de Cloudinary

    @Column({ default: 0 })
    orden!: number // para la galeria: cual va primero (la portada)

    @ManyToOne(() => Planificacion, (p) => p.imagenes, { onDelete: "CASCADE" })
    planificacion!: Planificacion

    @CreateDateColumn()
    created_at!: Date
}