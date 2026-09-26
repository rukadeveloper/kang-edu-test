import { cache } from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { cacheLife, cacheTag } from "next/cache"
import { createHash } from "crypto"
import { jwtVerify, JWTPayload } from "jose"

// 캐시 태그는 256자 제한이 있어 JWT 원문 대신 해시를 사용한다
export function authCacheTag(token: string) {
    return `auth-${createHash('sha256').update(token).digest('hex')}`
}

// 'use cache': 요청 간 서버 캐시. 인자(token)가 캐시 키가 되므로 사용자별로 분리된다.
// cookies()는 캐시 스코프 안에서 쓸 수 없어서 밖에서 읽어 인자로 넘긴다.
async function verifyToken(token: string): Promise<JWTPayload | null> {
    'use cache'
    cacheLife('minutes')
    cacheTag(authCacheTag(token))

    await new Promise(res => setTimeout(res, 1500))

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const verified = await jwtVerify(token, secret)
        return verified.payload
    } catch {
        return null
    }
}

// cache(): 같은 요청 안에서 layout, page 등이 여러 번 호출해도 한 번만 실행된다
export const getAuthUser = cache(async (): Promise<JWTPayload> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value

    if (!token) redirect('/login')

    const user = await verifyToken(token)

    // 캐시된 결과는 jwtVerify의 만료 검사를 거치지 않으므로 exp를 매번 직접 확인
    const isExpired = !user?.exp || user.exp * 1000 < Date.now()

    // redirect()는 내부적으로 에러를 throw하므로 try/catch 밖에서 호출
    if (!user || isExpired) redirect('/login')

    return user
})
