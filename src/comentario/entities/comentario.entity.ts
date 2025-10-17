import { Length, Max, Min } from "class-validator";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comentarios')
export class Comentario {

    @PrimaryGeneratedColumn()
    id: string;


    @Column('text')
    @Length(1, 500)  //limitar texto entre 1 y 500 caracteres
    text: string;

    @Column('int')
    @Min(1)
    @Max(5)
    rating: number;

    @Column('boolean', { default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Usuario, usuario => usuario.comentarios, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
    
}