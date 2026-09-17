import { Account, AccountRole, AccountType } from "@/types/types";

export type AccountAction = { type: string, payload?: string | string[] | null }

export default function accountReducer(state: Account, action: AccountAction) {
    switch (action.type) {
        case AccountType.LOGIN_LOADING:
            return { ...state, isLoading: true }
        case AccountType.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                email: action.payload![0],
                nickname: action.payload![1],
                accountType: action.payload![2] as AccountRole
            }
        case AccountType.LOGIN_FAILURE:
            return { ...state, isLoading: false, error: action.payload! as string }
        case AccountType.LOGOUT:
            return { ...state, email: null, nickname: null, accountType: null }
        default:
            return state
    }
}

export const accountInitialState: Account = {
    isLoading: false,
    email: '',
    nickname: '',
    accountType: null,
    error: null
}