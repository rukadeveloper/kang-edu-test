import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Lesson } from "./Lesson";
import { Teacher } from "./Teacher";

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string

    // FK 값만으로 저장·조회할 수 있도록 관계와 별도로 컬럼을 노출한다
    @Column({ name: 'lesson_id', type: 'uuid' })
    lessonId: string

    @ManyToOne(() => Lesson)
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson

    // 리포트를 작성한 선생님. 수업의 담당 선생님(main_teacher_id)과 다를 수 있다
    @Column({ name: 'teacher_id', type: 'uuid' })
    teacherId: string

    @ManyToOne(() => Teacher)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher

    @Column({ name: 'lesson_type' })
    lessonType: string

    @Column({ name: 'started_at', type: 'timestamptz' })
    startedAt: Date

    @Column({ name: 'ended_at', type: 'timestamptz' })
    endedAt: Date

    @Column({ name: 'report_content', type: 'text' })
    reportContent: string

    // 숙제가 없는 수업도 있어서 비워 둘 수 있다
    @Column({ name: 'homework_content', type: 'text', nullable: true })
    homeworkContent: string | null

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
