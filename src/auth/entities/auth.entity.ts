import { Compra } from "src/compra/entities/compra.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { Planificacion } from "src/planificacion/entities/planificacion.entity";

import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('text', {
        unique: true
    }
    )
    email!: string

    @Column('text', { nullable: true })
    password!: string | null

    @Column('text')
    name!: string

    @Column('text')
    lastname!: string

    @Column('bool', {
        default: true
    })
    isActive!: boolean

    @CreateDateColumn()
    createdAt!: Date;


    @Column('text', {
        array: true,
        default: ['user']
    })
    roles!: string[];

    @Column('varchar', { nullable: true })
    resetPasswordCode!: string | null;

    @Column('timestamp', { nullable: true })
    resetPasswordExpires!: Date | null;

    @Column('text', { nullable: true })
    avatarUrl!: string | null;

    @Column('text', { nullable: true })
    avatarPublicId!: string | null;

    //!si un usuario comun quiere empezar a vender planificaciones tendria que tener un rol mnas para diferenciarlo de la duena para poder cobrarle interes en las ventas


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }
    //! Campos para relaciones futuras CON PLANIFICACIONES, ROLES


    //relacion user - planificacion 1:n
    @OneToMany(() => Planificacion, planificacion => planificacion.user)
    planificaciones!: Planificacion[]

    //relacion con usuario-compra 1:n
    @OneToMany(() => Compra, (compra) => compra.user)
    compras!: Compra[];

    @OneToOne(() => Cart, { nullable: true })
    cart!: Cart;
}

