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

    @ManyToOne(() => User, user => user.planificaciones)
    @JoinColumn({ name: 'id_user_creador' })
    user: User;
    
    //relacion planificacion - materia 1:1
    @OneToOne(() => Materia, { eager: true })
    @JoinColumn({ name: 'id_materia' })
    materia: Materia;

    //relacion planificacion - grado 1:1
    @OneToOne(() => Grado, { eager: true })
    @JoinColumn({ name: 'id_grado' })
    grado: Grado;
}
