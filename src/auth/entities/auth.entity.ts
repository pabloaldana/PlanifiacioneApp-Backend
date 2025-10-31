import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {


    @PrimaryGeneratedColumn('uuid')
    id: string


    @Column('text',{
        unique:true
    }
    )
    email:string


    @Column('text')
    password:string


    @Column('text')
    name:string

    
    @Column('text')
    astname:string

    @Column('bool',{
       default:true
    })
    isActive:boolean


    //! Campos para relaciones futuras CON PLANIFICACIONES, ROLES

}
