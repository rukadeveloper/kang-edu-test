import { initializeDatabase } from '@/lib/database'
import { Teacher } from '@/entities/Teacher'
import { Student } from '@/entities/Student'

export type Account =
    | { role: 'teacher', account: Teacher }
    | { role: 'student', account: Student }

// instrumentation 번들과 앱 번들의 엔티티 클래스는 서로 다른 객체라 클래스로 찾으면 메타데이터를 못 찾는다.
// 테이블 이름으로 조회해야 어느 번들에서 초기화된 DataSource든 같은 메타데이터를 쓴다.
async function getRepositories() {
    const dataSource = await initializeDatabase()
    return {
        teachers: dataSource.getRepository<Teacher>('teachers'),
        students: dataSource.getRepository<Student>('students'),
    }
}

// teachers, students 테이블 접근은 이 레이어를 통해서만 한다
export const AccountRepository = {
    async findByEmail(email: string): Promise<Account | null> {
        const { teachers, students } = await getRepositories()
        const [teacher, student] = await Promise.all([
            teachers.findOneBy({ email }),
            students.findOneBy({ email }),
        ])

        if (teacher) return { role: 'teacher', account: teacher }
        if (student) return { role: 'student', account: student }
        return null
    },
}
