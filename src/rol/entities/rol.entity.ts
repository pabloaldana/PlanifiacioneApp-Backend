
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
//aca los roles son de los tipos de usuarios, admin profesor creador de contenido
//hay q guardar todo en miniscula en la base de datos

@Entity('roles')
export class Rol {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    
    @BeforeInsert()
    checkNameInsert(){
        this.name = this.name.toLowerCase().trim();
    }

}
