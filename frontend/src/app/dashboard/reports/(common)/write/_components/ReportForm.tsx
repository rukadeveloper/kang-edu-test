'use client'

import { startTransition, useActionState, useEffect, useRef } from "react"
import { createReport } from "@/app/server-actions/reportActions"

export default function ReportForm({ children }: { children: React.ReactNode }) {
    const [state, formAction, isPending] = useActionState(createReport, {
        success: false,
        message: ''
    })
    const formRef = useRef<HTMLFormElement>(null)

    // 저장에 성공했을 때만 입력값을 비운다
    useEffect(() => {
        if (state.success) formRef.current?.reset()
    }, [state])

    // <form action>으로 넘기면 React가 제출 직후 폼을 무조건 초기화해서,
    // 검증에 실패해도 작성한 내용이 사라진다. 직접 제출해서 초기화 시점을 위에서 정한다
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(() => formAction(formData))
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            {children}

            <div className="flex items-center justify-end gap-3 mt-5">
                {state.message && (
                    <p role="status" className={`mr-auto font-bold ${state.success ? 'text-[#5980A6]' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}
                <button
                    type="reset"
                    disabled={isPending}
                    className="cursor-pointer px-6 py-3 bg-white border border-gray-300 font-bold disabled:opacity-60"
                >
                    초기화
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer px-6 py-3 bg-gradient-to-b from-[#1E2F3F] to-[#2F4961] text-white font-bold disabled:opacity-60"
                >
                    {isPending ? '저장 중' : '저장'}
                </button>
            </div>
        </form>
    )
}
