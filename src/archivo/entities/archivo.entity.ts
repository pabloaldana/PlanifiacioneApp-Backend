import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



//UNA PLINIFIACION PUEDE TENER VARIOS ENLACES DE DESCARGA
@Entity()
export class Archivo {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    url:string


    //falta gregar la relacion con planificacion
}
