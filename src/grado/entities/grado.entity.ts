import { Planificacion } from "src/planificacion/entities/planificacion.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('grados')
export class Grado {

    @PrimaryGeneratedColumn()
    id:number

    //grado va ser de forma:primero,segundo,tercero,cuarto, quinto,sexto, septimo
    @Column('text',
        {unique:true}
    )
    name:string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(()=>Planificacion,planificacion=>planificacion.grado)
    planifiacion:Planificacion[]



    @BeforeInsert()
    @BeforeUpdate()
    normalizeFields() {
        if (this.name) {
        this.name = this.name
            .toLowerCase()
            .trim()
            .normalize("NFD")                   // separa letras de acentos
            .replace(/[\u0300-\u036f]/g, '')    // elimina los acentos
            .replace(/\s+/g, ' ');
     }
    }


}
