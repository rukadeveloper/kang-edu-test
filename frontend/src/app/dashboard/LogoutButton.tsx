'use client'

import { useFormStatus } from "react-dom"
import { logoutProcess } from "../server-actions/actions"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" disabled={pending} className="disabled:opacity-60 cursor-pointer w-full py-3 px-5 rounded-md text-left text-[15px] font-bold text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            {pending ? "로그아웃 중" : "로그아웃"}
        </button>
    )
}

export default function LogoutButton() {
    return (
        <form action={logoutProcess}>
            <SubmitButton />
        </form>
    )
}
