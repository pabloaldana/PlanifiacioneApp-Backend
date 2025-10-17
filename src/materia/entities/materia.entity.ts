import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



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

    @UpdateDateColumn()
    updated_at: Date;


    @BeforeInsert()
    checkName(){
        this.name = this.name.toLowerCase()
    }

    @BeforeInsert()
    checkDescription(){
        this.description = this.description.toLowerCase()
    }
    

}
