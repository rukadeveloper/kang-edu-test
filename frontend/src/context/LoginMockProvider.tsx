"use client"

import { AccountMock } from "@/types/types";
import React from "react";
import { createContext } from "react"

export const LoginMockContext = createContext<AccountMock>(null)

export default function LoginMockProvider({ children }: { children: React.ReactNode }) {
    const accountMock = {
        student: {
            email: 'harune135@naver.com',
            password: '13579'
        },
        teacher: {
            email: 'haruka@naver.com',
            password: '13579'
        }
    }

    return (
        <LoginMockContext.Provider value={accountMock}>
            {children}
        </LoginMockContext.Provider>
    )
}