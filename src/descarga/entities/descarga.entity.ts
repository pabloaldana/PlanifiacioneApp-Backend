import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('descargas')
export class Descarga {

    @PrimaryGeneratedColumn()
    id:number

    @Column('timestamp',{
        default: () => 'CURRENT_TIMESTAMP'
    })
    date:Date

}



// Descarga {
//   id (uuid) PK
//   usuario_id (uuid) FK -> Usuario.id
//   planificacion_id (uuid) FK -> Planificacion.id
//   fecha (timestamp, default now)
// }
// La tabla Descarga no es para controlar el acceso (eso lo hace la relación con Orden/OrdenItem), sino para registrar cada vez que el usuario descarga un archivo.
// Pero además se puede aprovechar para un panel de “Mis Descargas”, mostrando:
// Planificación que compró.
// Fecha de descarga.
// Enlace de descarga temporal (generado por el backend).

//!panel que veria con sus descargas
// Planificación	Fecha Descarga	Enlace de Descarga
// Lengua 1° grado	2025-09-28 11:20	[Descargar]
// Matemática 2° grado	2025-09-20 15:05	[Descargar]