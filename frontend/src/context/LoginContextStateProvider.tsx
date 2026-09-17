"use client";

import LoginContextDispatchProvider from "@/context/LoginContextDispatchProvider";
import loginReducer, { loginInitialState } from "@/reducers/loginReducer";
import { LoginType } from "@/types/types";
import { createContext, ReactNode, useReducer } from "react";

export const LoginStateContext = createContext<LoginType>(loginInitialState)

export default function LoginContextStateProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(loginReducer, loginInitialState)

    return (
        <LoginStateContext.Provider value={state}>
            <LoginContextDispatchProvider dispatch={dispatch}>
                {children}
            </LoginContextDispatchProvider>
        </LoginStateContext.Provider>
    )
}
