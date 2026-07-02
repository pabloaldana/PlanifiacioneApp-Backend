import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Planificacion } from "../../planificacion/entities/planificacion.entity";
import { normalizeString } from "src/common/utils/normalize-string.util";

@Entity('grados')
export class Grado {

    @PrimaryGeneratedColumn()
    id!: number

    //grado va ser de forma:primero,segundo,tercero,cuarto, quinto,sexto, septimo
    @Column('text',
        { unique: true }
    )
    name!: string

    @Column('int',
        { unique: true }
    )
    numero!: number

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Planificacion, planificacion => planificacion.grado)
    planificacion!: Planificacion[]



    @BeforeInsert()
    @BeforeUpdate()
    normalizeFields() {
        if (this.name) this.name = normalizeString(this.name);
    }


}
