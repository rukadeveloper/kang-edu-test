"use client"

import { AccountStateContext } from "@/context/AccountStateProvider"
import { useContext } from "react"

export default function FunctionTitle({ title }: { title: string }) {
    const accountState = useContext(AccountStateContext);

    return (
        <div id="functionTitle" className="flex justify-between items-center px-[16px] py-[20px] box-border bg-white">
            <h2 className="text-[22px]">{title}</h2>
            <div id="writer" className="flex flex-col">
                <p className="text-[14px]">작성자</p>
                <p className="text-[14px]">{accountState.nickname}</p>
            </div>
        </div>
    )
}