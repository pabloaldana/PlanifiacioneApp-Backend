import { Comentario } from "src/comentario/entities/comentario.entity";
import { Rol } from "src/rol/entities/rol.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text')
    name:string
    
    @Column('text')
    lastname:string

    @Column('varchar',{
        unique:true,
    })
    email:string

    @Column('boolean', { default: true })
    is_active: boolean;
    
    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(
        ()=>Rol,
        (rol)=>rol.usuarios,
        {eager:true}
    )
    rol:Rol

   // Relacion con Comentarios
  @OneToMany(() => Comentario, comentario => comentario.usuario)
  comentarios: Comentario[];
}
