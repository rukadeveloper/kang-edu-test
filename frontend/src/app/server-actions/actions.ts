'use server'

import { redirect } from "next/navigation"
import { cookies } from 'next/headers'
import { SignJWT } from "jose"
import { updateTag } from "next/cache"
import { authCacheTag } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { AccountRepository } from "@/repositories/AccountRepository"

export interface LoginState {
    success: boolean
    message: string
}

export async function loginProcess(prevState: LoginState, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !email.includes('@')) return { success: false, message: '이메일 형식에 맞지 않아요.' }
    if (!password || password.length < 5 || password.length > 8) return { success: false, message: '비밀번호 형식에 맞지 않아요.' }

    const found = await AccountRepository.findByEmail(email)

    if (!found) return { success: false, message: '이메일이 올바르지 않습니다.' }

    const { role, account } = found
    const isPasswordValid = await bcrypt.compare(password, account.password)

    if (!isPasswordValid) return { success: false, message: '비밀번호가 올바르지 않습니다.' }

    const token = await generateToken(account.id, account.email, role)

    const cookieStore = await cookies()

    cookieStore.set('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    })

    redirect("/")
}

export async function logoutProcess() {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value

    // 해당 토큰의 인증 캐시를 즉시 만료
    if (token) updateTag(authCacheTag(token))

    cookieStore.delete('authToken')

    redirect('/login')
}

async function generateToken(userId: string, email: string, role: string) {
    const payload = { 
        sub: userId,
        email, 
        role, 
        iat: Math.floor(Date.now() / 1000), 
        exp: Math.floor((Date.now() / 1000) + 60 * 60 * 24 * 7)
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT(payload)
                            .setProtectedHeader({ alg: 'HS256' })
                            .sign(secret)

    return token
}
