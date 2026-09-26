import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    phone: string

    @Column({ name: 'is_contact', default: false })
    isContact: boolean

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ type: 'text', nullable: true })
    accessToken: string | null

    @Column({ type: 'text', nullable: true })
    refreshToken: string | null
}
