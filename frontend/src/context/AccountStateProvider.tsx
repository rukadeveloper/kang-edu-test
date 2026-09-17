"use client"

import accountReducer, { accountInitialState } from "@/reducers/accountReducer";
import { Account } from "@/types/types";
import React, { createContext, useReducer } from "react";
import AccountDispatchProvider from "./AccountDispatchProvider";

export const AccountStateContext = createContext<Account>(accountInitialState)

export default function AccountStateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(accountReducer, accountInitialState)

    return (
        <AccountStateContext.Provider value={state}>
            <AccountDispatchProvider dispatch={dispatch}>
                {children}
            </AccountDispatchProvider>
        </AccountStateContext.Provider>
    )
}