"use client";

import { AccountDispatchContext } from "@/context/AccountDispatchProvider";
import { AccountStateContext } from "@/context/AccountStateProvider";
import { LoginDispatchContext } from "@/context/LoginContextDispatchProvider";
import { AccountType, LoginActionType } from "@/types/types";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react";

const teacherMenu = [
    {
        title: "보고서",
        sub: [
            { type: 'link', nav: '/', name: '홈' },
            { type: 'link', nav: '/report-new', name: '보고서 작성' },
            { type: 'link', nav: '/student-report', name: '학생 보고서 조회' }
        ]
    }
]

const studentMenu = [
    {
        title: "보고서",
        sub: [
            { type: 'link', nav: '/', name: '홈' },
            { type: 'link', nav: '/student-report', name: '내 보고서 조회' }
        ]
    }
]

const accountMenu = [
    {
        title: "계정",
        sub: [
            { type: 'button', nav: "/login", name: "로그아웃" }
        ]
    }
]

export default function DashboardAside() {
    const location = usePathname()
    const accountDispatch = useContext(AccountDispatchContext)
    const accountState = useContext(AccountStateContext)
    const loginDispatch = useContext(LoginDispatchContext)

    const menuMocks = [
        ...(accountState.accountType === 'student' ? studentMenu : teacherMenu),
        ...accountMenu
    ]

    return (
        <div id="sideBar" className="w-[300px] min-h-screen bg-[#1d2d3d] px-[20px] py-[26px] box-border">
            <h2 className="text-white pb-[26px] border-b border-gray-300">수업 관리 프로그램</h2>
            <div id="sideBarMenu" className="mt-[30px]">
                {menuMocks.map(m => (
                    <div key={m.title} className="main_menu pt-[20px]">
                        <h3 className="text-gray-300 text-[14px] pb-[20px]">{m.title}</h3>
                        <ul>
                            {m.sub.map(s => <li key={s.name}>
                                {
                                    s.type === 'link' ?
                                        <Link className={`block text-[16px] text-white px-[20px] py-[26px] ${location === s.nav ? "bg-[#5980A6]" : ""}`} href={s.nav}>{s.name}</Link>
                                        : <button className="text-white px-[20px] cursor-pointer" onClick={() => {
                                            accountDispatch({ type: AccountType.LOGOUT })
                                            loginDispatch({ type: LoginActionType.RESET_ALL })
                                        }}>{s.name}</button>
                                }
                            </li>)}
                        </ul>
                    </div>
                ))
                }
            </div>
        </div>
    )
}