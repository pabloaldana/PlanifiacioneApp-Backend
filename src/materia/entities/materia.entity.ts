import { Planificacion } from "src/planificacion/entities/planificacion.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { normalizeString } from "src/common/utils/normalize-string.util";



@Entity('materias')
export class Materia {

    @PrimaryGeneratedColumn()
    id!: number

    @Column('text', { unique: true })
    name!: string

    @Column('text', { nullable: true })
    description!: string

    @CreateDateColumn()
    created_at!: Date;

    // @UpdateDateColumn()
    // updated_at: Date;
    // planificaciones: any;


    @BeforeInsert()
    normalizeFields() {
        if (this.name) this.name = normalizeString(this.name);
        if (this.description) this.description = normalizeString(this.description);
    }

    planificacionesCount?: number;

    @OneToMany(() => Planificacion, planificacion => planificacion.materia)
    planificaciones!: Planificacion[];


}
