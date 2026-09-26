import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    // FK 값만으로 저장·조회할 수 있도록 관계와 별도로 컬럼을 노출한다
    @Column({ name: 'student_id', type: 'uuid' })
    studentId: string

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student

    @Column({ name: 'main_teacher_id', type: 'uuid' })
    mainTeacherId: string

    @ManyToOne(() => Teacher)
    @JoinColumn({ name: 'main_teacher_id' })
    mainTeacher: Teacher

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
