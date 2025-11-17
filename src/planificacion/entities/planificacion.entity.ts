import { join } from "path";
import { User } from "src/auth/entities/auth.entity";
import { Grado } from "src/grado/entities/grado.entity";
import { Materia } from "src/materia/entities/materia.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    //se obtiene cuando se sube la planificacion a cloudinary
    @Column({ type: 'varchar', length: 500 })
    url: string;
 //se obtiene cuando se sube la planificacion a cloudinary
    @Column({ type: 'varchar', length: 255 })
    public_id: string;

    @Column('boolean', { default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    //! FALTA RELACION CON DOCENTE,MATERIA,GRADO, createat y el update

    @ManyToOne(() => Materia, materia => materia.planificaciones, { eager: true })
    @JoinColumn({ name: 'materiaId' })
    materia: Materia;

    @ManyToOne(() => User, user => user.planificaciones)
    @JoinColumn({ name: 'id_user_creador' })
    user: User;
  
    //relacion planificacion - grado 1:1
    @ManyToOne(()=>Grado, grado=> grado.planifiacion,{eager:true})
    @JoinColumn({name:'gradoId'})
    grado: Grado;
}
