import { Planificacion } from "src/planificacion/entities/planificacion.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('materias')
export class Materia {

    @PrimaryGeneratedColumn()
    id:number

    @Column('text',{unique:true})
    name:string

    @Column('text',{nullable:true})
    description:string

    @CreateDateColumn()
    created_at: Date;

    // @UpdateDateColumn()
    // updated_at: Date;
    // planificaciones: any;


    @BeforeInsert()
    checkName(){
        this.name = this.name.toLowerCase()
    }

    @BeforeInsert()
    checkDescription(){
        this.description = this.description.toLowerCase()
    }

    @OneToMany(() => Planificacion, planificacion => planificacion.materia)
    planificaciones: Planificacion[];
    

}
