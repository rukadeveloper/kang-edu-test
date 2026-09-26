'use client'

import { useFormStatus } from "react-dom"

export default function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" disabled={pending} className="disabled:opacity-60 cursor-pointer w-full text-[14px] py-[12px] bg-gradient-to-b from-[#1E2F3F] to-[#2F4961] text-white">
            {pending ? "로그인 중" : "로그인하기"}
        </button>
    )
}