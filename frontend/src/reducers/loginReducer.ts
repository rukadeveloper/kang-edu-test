import { LoginActionType, loginSituation, LoginType } from "@/types/types";

export type LoginAction = { type: string, payload?: string }

export default function loginReducer(state: LoginType, action: LoginAction) {
    switch (action.type) {
        case LoginActionType.RESET_ALL: {
            return loginInitialState
        }
        case LoginActionType.CHANGE_EMAIL: {
            return { ...state, email: { ...state.email, value: action.payload! } }
        }
        case LoginActionType.EMAIL_TOUCHED: {
            return { ...state, email: { ...state.email, isTouched: true } }
        }
        case LoginActionType.EMAIL_ERROR: {
            if (state.email.isTouched) {
                return {
                    ...state,
                    email: {
                        ...state.email,
                        error: loginSituation(action.payload!).NOT_EMAIL_DESIGN ? "이메일 형식을 확인하세요" : ""
                    }
                }
            }
            return state
        }
        case LoginActionType.EMAIL_SUCCESS: {
            if (state.email.isTouched) {
                return {
                    ...state,
                    email: {
                        ...state.email,
                        success: loginSituation(action.payload!).IS_EMAIL_DESIGN ? "올바른 이메일입니다." : ""
                    }
                }
            }
            return state
        }
        case LoginActionType.CHANGE_PASSWORD: {
            return {
                ...state,
                password: {
                    ...state.password,
                    value: action.payload!
                }
            }
        }
        case LoginActionType.PASSWORD_TOUCHED: {
            return {
                ...state,
                password: {
                    ...state.password,
                    isTouched: true
                }
            }
        }
        case LoginActionType.PASSWORD_ERROR: {
            if (state.password.isTouched) {
                return {
                    ...state,
                    password: {
                        ...state.password,
                        error: loginSituation(action.payload!).PASSWORD_LENGTH_OVER_4_UNDER_8 ? "" : "4글자 이상, 8글자 이하여야 합니다."
                    }
                }
            }
            return state
        }
        case LoginActionType.PASSWORD_SUCCESS: {
            if (state.password.isTouched) {
                return {
                    ...state,
                    password: {
                        ...state.password,
                        success: loginSituation(action.payload!).PASSWORD_LENGTH_OVER_4_UNDER_8 ? "올바른 패스워드입니다." : ""
                    }
                }
            }
            return state
        }
        default:
            return state
    }
}

export const loginInitialState: LoginType = {
    email: {
        value: '',
        error: '',
        success: '',
        isTouched: false
    },
    password: {
        value: '',
        error: '',
        success: '',
        isTouched: false
    }
}