// Next.js 서버 인스턴스가 시작될 때 한 번 실행되며, 끝나야 요청을 받기 시작한다
export async function register() {
    // typeorm/pg는 Node.js 전용이라 Edge 런타임에서는 불러오지 않는다
    if (process.env.NEXT_RUNTIME !== 'nodejs') return

    const { initializeDatabase } = await import('./lib/database')
    await initializeDatabase()
}
