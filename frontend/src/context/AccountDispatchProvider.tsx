import { AccountAction } from "@/reducers/accountReducer";
import React, { createContext, Dispatch } from "react";

export const AccountDispatchContext = createContext<Dispatch<AccountAction>>(() => { })

export default function AccountDispatchProvider({ dispatch, children }: { dispatch: Dispatch<AccountAction>, children: React.ReactNode }) {
    return (
        <AccountDispatchContext.Provider value={dispatch}>
            {children}
        </AccountDispatchContext.Provider>
    )
}