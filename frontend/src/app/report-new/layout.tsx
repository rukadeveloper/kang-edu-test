import DashboardAside from "@/components/DashboardAside";
import RequireAuth from "@/components/RequireAuth";
import React from "react";

export default function ReportNewLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            <div className="layout flex">
                <DashboardAside />
                <main className="flex-1">{children}</main>
            </div>
        </RequireAuth>
    )
}