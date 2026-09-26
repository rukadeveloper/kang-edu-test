'use server'

import { redirect } from "next/navigation"

const loginStatus = {
    student: {
        email: 'harune135@naver.com',
        password: '12345'
    },
    teacher: {
        email: 'haruka135@naver.com',
        password: '12345'
    }
}

export async function loginProcess(prevState: { success: boolean, message: string | null }, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !email.includes('@')) return { success: false, message: '이메일 형식에 맞지 않아요.' }
    if (!password || password.length < 5 || password.length > 8) return { success: false, message: '비밀번호 형식에 맞지 않아요.' }

    for (const statusKey in loginStatus) {
        if (statusKey === 'student') {
            if (email !== loginStatus[statusKey].email) {
                return { success: false, message: '이메일이 올바르지 않습니다.' }
            }
            if (password !== loginStatus[statusKey].password) {
                return { success: false, message: '비밀번호가 올바르지 않습니다.' }
            }
            redirect("/")
        }
        if (statusKey === 'teacher') {
            if (email !== loginStatus[statusKey].email) {
                return { success: false, message: '이메일이 올바르지 않습니다.' }
            }
            if (password !== loginStatus[statusKey].password) {
                return { success: false, message: '비밀번호가 올바르지 않습니다.' }
            }
            redirect("/")
        }
    }
}