import { join } from "path";
import { User } from "src/auth/entities/auth.entity";
import { Compra } from "src/compra/entities/compra.entity";
import { Grado } from "src/grado/entities/grado.entity";
import { Materia } from "src/materia/entities/materia.entity";
import { AfterInsert, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    //relacion planifiacion-compra 1:n
    @OneToMany(()=> Compra, compra=>compra.planificacion)
    compras: Compra[]


    //! aca va para guardar todo en minuscula
     @BeforeInsert()
        @BeforeUpdate()
        normalizeFields() {
            if (this.title) {
            this.title = this.title
                .toLowerCase()
                .trim()
                .normalize("NFD")                   // separa letras de acentos
                .replace(/[\u0300-\u036f]/g, '')    // elimina los acentos
                .replace(/\s+/g, ' ');
            }
            if (this.description) {
            this.description = this.description
                .toLowerCase()
                .trim()
                .normalize("NFD")                   // separa letras de acentos
                .replace(/[\u0300-\u036f]/g, '')    // elimina los acentos
                .replace(/\s+/g, ' ');
            }
        }
}
