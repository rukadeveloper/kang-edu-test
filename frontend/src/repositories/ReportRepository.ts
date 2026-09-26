import { initializeDatabase } from '@/lib/database'
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm'
import { Report } from '@/entities/Report'

// 클래스 대신 테이블 이름으로 조회하는 이유는 AccountRepository 참고
async function getRepository() {
    const dataSource = await initializeDatabase()
    return dataSource.getRepository<Report>('reports')
}

export type CreateReportInput = Pick<Report,
    'lessonId' | 'teacherId' | 'lessonType' | 'startedAt' | 'endedAt' | 'reportContent' | 'homeworkContent'>

// 목록 화면용. 수업·학생·작성 선생님은 이름과, 수업 완료 판정에 필요한 값(main_teacher_id, is_contact)만 가져온다
const listRelations: FindOptionsRelations<Report> = { lesson: { student: true }, teacher: true }

const listSelect: FindOptionsSelect<Report> = {
    id: true,
    lessonType: true,
    startedAt: true,
    endedAt: true,
    reportContent: true,
    homeworkContent: true,
    lesson: { id: true, name: true, mainTeacherId: true, student: { id: true, name: true } },
    teacher: { id: true, name: true, isContact: true },
}

// reports 테이블 접근은 이 레이어를 통해서만 한다
export const ReportRepository = {
    async create(input: CreateReportInput): Promise<Report> {
        const repository = await getRepository()
        return repository.save(repository.create(input))
    },

    // 학생의 수업(lesson.student_id)에 달린 보고서를 최근 수업 순으로 가져온다
    async findByStudentId(studentId: string): Promise<Report[]> {
        const repository = await getRepository()
        return repository.find({
            where: { lesson: { studentId } },
            relations: listRelations,
            select: listSelect,
            order: { startedAt: 'DESC' },
        })
    },

    // 선생님이 직접 작성한 보고서 + 담당 수업(lesson.main_teacher_id)에 달린 보고서 (where 배열은 OR)
    async findByTeacherId(teacherId: string): Promise<Report[]> {
        const repository = await getRepository()
        return repository.find({
            where: [
                { teacherId },
                { lesson: { mainTeacherId: teacherId } },
            ],
            relations: listRelations,
            select: listSelect,
            order: { startedAt: 'DESC' },
        })
    },
}
