'use client'

import { useActionState } from "react";
import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";
import { loginProcess } from "../server-actions/actions";

export default function LoginBox() {
    const [state, formAction] = useActionState(loginProcess, {
        success: false,
        message: null
    })

    return (
        <div id="loginBox" className="max-w-md box-border p-8 bg-[#f2f2f3] flex flex-col items-center">
            <h1 className="barlow_condensed text-2xl text-[#5980A6] font-semibold mb-[1.2rem]">Report</h1>
            <h2 className="text-xl font-bold mb-[0.8rem]">수업 보고서 시스템</h2>
            <p className="font-light text-[#7a7a7d] text-[14px] pb-[2rem] mb-[2rem] border-b border-[#E7E7EA]">교사용 혹은 학생용 포털에 로그인하세요.</p>
            <form className="w-full" action={formAction}>
                <LoginInput divId={"idInput"} type={"text"} name={"email"} placeholder={"your@school.edu"} />
                <LoginInput divId={"pwInput"} type={"password"} name={"password"} placeholder={"비밀번호를 입력하세요."} />
                <LoginButton />
            </form>
        </div >
    )
}