import { initializeDatabase } from '@/lib/database'
import { Lesson } from '@/entities/Lesson'

// 클래스 대신 테이블 이름으로 조회하는 이유는 AccountRepository 참고
async function getRepository() {
    const dataSource = await initializeDatabase()
    return dataSource.getRepository<Lesson>('lessons')
}

// lessons 테이블 접근은 이 레이어를 통해서만 한다
export const LessonRepository = {
    // 같은 이름의 수업을 구분할 수 있도록 학생 이름을 함께 가져온다
    async findAllWithStudent(): Promise<Lesson[]> {
        const repository = await getRepository()
        return repository.find({
            select: { id: true, name: true, student: { id: true, name: true } },
            relations: { student: true },
            order: { name: 'ASC' },
        })
    },
}
