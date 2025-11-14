import { Rol } from "src/rol/entities/rol.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { JoinColumn, OneToOne } from "typeorm";

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

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
    }
    //! Campos para relaciones futuras CON PLANIFICACIONES, ROLES

    @OneToOne(()=>Rol,{eager:true})
    @JoinColumn({name:'id_rol'})
    rol:Rol

    //todo: eager:true hace que cada vez que traiga un user, me traiga el rol asociado
}
