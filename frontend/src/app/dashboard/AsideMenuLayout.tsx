import { getAuthUser } from "@/lib/auth"
import TeacherNav from "./TeacherNav"
import StudentNav from "./StudentNav"
import LogoutButton from "./LogoutButton"

export default async function AsideMenuLayout() {
    const user = await getAuthUser()

    return (
        <aside className="w-[300px] h-screen bg-[#1C2D3D] p-6 box-border flex flex-col">
            <h1 className="text-2xl barlow_condensed font-bold text-white mb-5">Report</h1>
            <h2 className="text-md pb-5 tracking-tight font-light text-white border-b border-gray-600">수업 보고서</h2>
            {user.role === 'teacher' ? <TeacherNav /> : <StudentNav />}
            {/* 역할과 무관하게 공통으로 사용하는 영역 */}
            <div className="mt-auto pt-5 border-t border-gray-600">
                <LogoutButton />
            </div>
        </aside>
    )
}

// user를 기다리는 동안 보여줄 사이드바 스켈레톤 (고정 영역은 그대로 노출)
export function AsideMenuSkeleton() {
    return (
        <aside className="w-[300px] h-screen bg-[#1C2D3D] p-6 box-border">
            <h1 className="text-2xl barlow_condensed font-bold text-white mb-5">Report</h1>
            <h2 className="text-md pb-5 tracking-tight font-light text-white border-b border-gray-600">수업 보고서</h2>
            <div className="mt-5 flex flex-col gap-3 animate-pulse">
                <div className="h-5 rounded bg-gray-600" />
                <div className="h-5 rounded bg-gray-600" />
                <div className="h-5 rounded bg-gray-600" />
            </div>
        </aside>
    )
}
