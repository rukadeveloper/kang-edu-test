export type LoginType = {
    email: {
        value: string;
        error: string;
        success: string;
        isTouched: boolean;
    },
    password: {
        value: string;
        error: string;
        success: string;
        isTouched: boolean;
    }
}

export const LoginActionType = {
    RESET_ALL: "RESET_ALL",
    CHANGE_EMAIL: "CHANGE_EMAIL",
    EMAIL_TOUCHED: "EMAIL_TOUCHED",
    EMAIL_ERROR: "EMAIL_ERROR",
    EMAIL_SUCCESS: "EMAIL_SUCCESS",
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    PASSWORD_TOUCHED: "PASSWORD_TOUCHED",
    PASSWORD_ERROR: "PASSWORD_ERROR",
    PASSWORD_SUCCESS: "PASSWORD_SUCCESS"
}

export function loginSituation(value: string) {
    return {
        "NOT_EMAIL_DESIGN": !value.includes("@"),
        "IS_EMAIL_DESIGN": value.includes("@"),
        "PASSWORD_LENGTH_OVER_4_UNDER_8": value.length >= 4 && value.length < 8,
    }
}

export type AccountMock = {
    student: {
        email: string;
        password: string;
    },
    teacher: {
        email: string;
        password: string;
    }
} | null

export type AccountRole = "student" | "teacher"

export type Account = {
    isLoading: boolean;
    email: string | null;
    nickname: string | null;
    accountType: AccountRole | null;
    error: string | null
}

export const AccountType = {
    LOGIN_LOADING: "LOGIN_LOADING",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILURE: "LOGIN_FAILURE",
    LOGOUT: "LOGOUT"
}