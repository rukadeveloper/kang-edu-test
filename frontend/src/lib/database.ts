import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Teacher } from '../entities/Teacher'
import { Student } from '../entities/Student'
import { Lesson } from '../entities/Lesson'
import { Report } from '../entities/Report'

function createDataSource() {
    return new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        entities: [Teacher, Student, Lesson, Report],
        migrations: ['src/migrations/*.ts'],
        subscribers: []
    })
}

// 개발 모드 HMR로 모듈이 다시 실행돼도 커넥션 풀이 중복 생성되지 않도록 globalThis에 보관
const globalForDb = globalThis as unknown as {
    dataSource?: DataSource
    initPromise?: Promise<DataSource>
}

export const AppDataSource = globalForDb.dataSource ?? createDataSource()
globalForDb.dataSource = AppDataSource

export function initializeDatabase(): Promise<DataSource> {
    if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource)

    // 동시에 여러 요청이 들어와도 initialize()는 한 번만 실행
    globalForDb.initPromise ??= AppDataSource.initialize().catch((error) => {
        globalForDb.initPromise = undefined
        throw error
    })

    return globalForDb.initPromise
}
