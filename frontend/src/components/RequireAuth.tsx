"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountStateContext } from "@/context/AccountStateProvider";
import LoadingIndicator from "./LoadingIndicator";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const accountState = useContext(AccountStateContext);
    const router = useRouter();
    const isAuthenticated = Boolean(accountState.email);

    useEffect(() => {
        if (!accountState.isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [accountState.isLoading, isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F2F3]">
                <LoadingIndicator label="로그인 페이지로 이동 중..." />
            </div>
        );
    }

    return <>{children}</>;
}
