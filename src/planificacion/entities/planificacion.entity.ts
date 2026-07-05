import { User } from "src/auth/entities/auth.entity";
import { normalizeString } from "src/common/utils/normalize-string.util";
import { Compra } from "src/compra/entities/compra.entity";
import { Grado } from "src/grado/entities/grado.entity";
import { Materia } from "src/materia/entities/materia.entity";
import { AfterInsert, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlanificacionImagen } from "src/planificacion-imagen/entities/planificacion-imagen.entity";

@Entity('planificaciones')
export class Planificacion {

    @PrimaryGeneratedColumn()
    id!: number

    @Column('text', {
        unique: true
    })
    title!: string

    @Column('text', {
        nullable: true
    })
    description!: string

    @Column('int', {
        default: 0
    })
    price!: number

    @Column({ type: 'varchar', length: 500 })
    url!: string;
    @Column({ type: 'varchar', length: 255 })
    public_id!: string;
    @Column({ type: 'varchar', length: 10, default: 'pdf' })
    file_format!: string;

    @Column('boolean', { default: true })
    is_active!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Materia, materia => materia.planificaciones, { eager: true })
    @JoinColumn({ name: 'materiaId' })
    materia!: Materia;

    @ManyToOne(() => User, user => user.planificaciones)
    @JoinColumn({ name: 'id_user_creador' })
    user!: User;

    //relacion planificacion - grado 1:1
    @ManyToOne(() => Grado, grado => grado.planificacion, { eager: true })
    @JoinColumn({ name: 'gradoId' })
    grado!: Grado;

    //relacion planifiacion-compra 1:n
    @OneToMany(() => Compra, compra => compra.planificacion)
    compras!: Compra[]

    //relacion planificacion-imagenes 1:n
    @OneToMany(() => PlanificacionImagen, imagen => imagen.planificacion)
    imagenes!: PlanificacionImagen[]


    @BeforeInsert()
    @BeforeUpdate()
    normalizeFields() {
        if (this.title) this.title = normalizeString(this.title);
        if (this.description) this.description = normalizeString(this.description);
    }
}
