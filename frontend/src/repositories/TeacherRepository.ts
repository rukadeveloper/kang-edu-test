import { initializeDatabase } from '@/lib/database'
import { Teacher } from '@/entities/Teacher'

// 클래스 대신 테이블 이름으로 조회하는 이유는 AccountRepository 참고
async function getRepository() {
    const dataSource = await initializeDatabase()
    return dataSource.getRepository<Teacher>('teachers')
}

export const TeacherRepository = {
    // 선택 목록용이라 비밀번호·토큰은 가져오지 않는다
    async findAll(): Promise<Pick<Teacher, 'id' | 'name'>[]> {
        const repository = await getRepository()
        return repository.find({
            select: { id: true, name: true },
            order: { name: 'ASC' },
        })
    },
}
