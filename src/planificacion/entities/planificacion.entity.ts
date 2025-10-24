import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('planificaciones')
export class Planificacion {

    @PrimaryGeneratedColumn()
    id:number

    @Column('text',{
        unique:true
    })
    title:string

    @Column('text',{
        nullable:true
    })
    description: string

    @Column('int',{
        default:0
    })
    price:number

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'varchar', length: 255 })
    public_id: string;

    @Column('boolean', { default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    //! FALTA RELACION CON DOCENTE,MATERIA,GRADO, createat y el update
}
