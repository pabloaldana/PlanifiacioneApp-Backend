import { Planificacion } from "src/planificacion/entities/planificacion.entity";

import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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
    lastname:string

    @Column('bool',{
       default:true
    })
    isActive:boolean

    @Column('text',{
        array:true,
        default:['user']
    })
    roles:string[];

    //!si un usuario comun quiere empezar a vender planificaciones tendria que tener un rol mnas para diferenciarlo de la duena para poder cobrarle interes en las ventas


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
    }
    //! Campos para relaciones futuras CON PLANIFICACIONES, ROLES


    //relacion user - planificacion 1:n
    @OneToMany(()=>Planificacion,planificacion => planificacion.user)
    planificaciones:Planificacion[]

    //todo: eager:true hace que cada vez que traiga un user, me traiga el rol asociado
}

