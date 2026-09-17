"use client";

import { LoginAction } from "@/reducers/loginReducer";
import { createContext, Dispatch, ReactNode } from "react";

export const LoginDispatchContext = createContext<Dispatch<LoginAction>>(() => { })

export default function LoginContextDispatchProvider(
    { children, dispatch }: { children: ReactNode, dispatch: Dispatch<LoginAction> }
) {
    return (
        <LoginDispatchContext.Provider value={dispatch}>
            {children}
        </LoginDispatchContext.Provider>
    )
}
