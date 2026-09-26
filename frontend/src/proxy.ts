import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

async function isValidToken(token: string | undefined) {
    if (!token) return false

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        await jwtVerify(token, secret)
        return true
    } catch {
        return false
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('authToken')?.value
    const isLoginPage = pathname === '/login' || pathname.startsWith('/login/')
    const isAuthenticated = await isValidToken(token)

    // 로그인된 상태로 /login 접근 시 / 로 이동
    if (isLoginPage) {
        if (isAuthenticated) return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.next()
    }

    // 토큰이 없거나 유효하지 않으면 /login 으로 이동
    if (!isAuthenticated) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        // 만료/위조된 토큰은 삭제해서 리다이렉트 루프 방지
        if (token) response.cookies.delete('authToken')
        return response
    }

    return NextResponse.next()
}

export const config = {
    // API, Next 내부 파일, 정적 파일은 제외
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)'],
}
