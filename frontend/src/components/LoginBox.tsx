"use client";

import { LoginDispatchContext } from "@/context/LoginContextDispatchProvider";
import { LoginStateContext } from "@/context/LoginContextStateProvider";
import React, { useContext } from "react";
import CommonInput from "./CommonInput";
import { AccountType, LoginActionType } from "@/types/types";
import { LoginMockContext } from "@/context/LoginMockProvider";
import { useRouter } from "next/navigation";
import { AccountDispatchContext } from "@/context/AccountDispatchProvider";

export default function LoginBox() {
    const state = useContext(LoginStateContext)
    const dispatch = useContext(LoginDispatchContext)
    const loginMocks = useContext(LoginMockContext)
    const accountDispatch = useContext(AccountDispatchContext)

    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        accountDispatch({ type: AccountType.LOGIN_LOADING })

        const loginFailureMessage = '로그인이 실패했습니다. 아이디 및 비밀번호를 확인해주세요.'

        if (!state.email.value || state.email.error || !state.password.value || state.password.error) {
            accountDispatch({ type: AccountType.LOGIN_FAILURE, payload: loginFailureMessage })
            alert(loginFailureMessage)
            dispatch({ type: LoginActionType.RESET_ALL })
            return;
        }

        const matchedRole = (Object.keys(loginMocks ?? {}) as Array<'student' | 'teacher'>).find(
            (key) => loginMocks![key].email === state.email.value && loginMocks![key].password === state.password.value
        )

        if (matchedRole) {
            accountDispatch({ type: AccountType.LOGIN_SUCCESS, payload: [state.email.value, '코타님', matchedRole] })
            alert(`${matchedRole} 계정으로 로그인되었습니다!`)
            router.push("/")
            dispatch({ type: LoginActionType.RESET_ALL })
            return
        }

        accountDispatch({ type: AccountType.LOGIN_FAILURE, payload: loginFailureMessage })
        alert(loginFailureMessage)
        dispatch({ type: LoginActionType.RESET_ALL })
    }

    return (
        <div id="loginBox" className="w-[400px] h-[calc(100vh-40px)] bg-[#F2F2F3] px-[20px] box-border">
            <form onSubmit={handleSubmit}>
                <div id="formWrap">
                    <h2 className="text-center text-[20px] pt-[20px]">수업 보고서 시스템</h2>
                    <p className="text-center text-[14px] pt-[10px] text-[#B2BBC5]">학생 혹은 교사 계정으로 로그인하세요.</p>
                    <CommonInput
                        htmlFor={"loginId"}
                        type={"text"}
                        label={"로그인"}
                        value={state.email.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value
                            dispatch({ type: LoginActionType.CHANGE_EMAIL, payload: value })
                            dispatch({ type: LoginActionType.EMAIL_ERROR, payload: value })
                            dispatch({ type: LoginActionType.EMAIL_SUCCESS, payload: value })
                        }}
                        isTouched={state.email.isTouched}
                        setIsTouched={() => {
                            dispatch({ type: LoginActionType.EMAIL_TOUCHED })
                        }}
                        error={state.email.error}
                        success={state.email.success}
                    />
                    <CommonInput
                        htmlFor={"loginPassword"}
                        type={"password"}
                        label={"패스워드"}
                        value={state.password.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value
                            dispatch({ type: LoginActionType.CHANGE_PASSWORD, payload: value })
                            dispatch({ type: LoginActionType.PASSWORD_ERROR, payload: value })
                            dispatch({ type: LoginActionType.PASSWORD_SUCCESS, payload: value })
                        }}
                        setIsTouched={() => {
                            dispatch({ type: LoginActionType.PASSWORD_TOUCHED })
                        }}
                        isTouched={state.password.isTouched}
                        error={state.password.error}
                        success={state.password.success}
                    />
                    <button className="cursor-pointer text-[14px] w-full py-[16px] mt-[16px] bg-[#5980A6] text-white">로그인하기</button>
                </div>
            </form>
        </div>
    )
}