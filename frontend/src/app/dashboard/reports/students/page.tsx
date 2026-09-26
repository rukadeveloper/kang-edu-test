import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { ReportRepository } from "@/repositories/ReportRepository";
import ReportCard from "../_components/ReportCard";
import { countCompletedLessons, countCompletedLessonsBy } from "@/lib/lessonCompletion";

export default async function StudentReportsPage() {
    // DB 조회는 요청 시점에만 실행되도록 프리렌더를 여기서 멈춘다
    await connection()

    const user = await getAuthUser()

    // 학생 전용 페이지. 토큰의 sub가 곧 학생 id라 다른 학생의 보고서는 조회할 수 없다
    if (user.role !== 'student' || !user.sub) redirect('/dashboard')

    const reports = await ReportRepository.findByStudentId(user.sub)

    const completedCount = countCompletedLessons(reports)
    const completedByLesson = countCompletedLessonsBy(reports, (report) => report.lesson)

    return (
        <div className="p-7 box-border h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-5">
            <section className="shadow-sm bg-white box-border p-6 border-t-4 border-[#5980A6]">
                <h2 className="text-[#5980A6] pb-4 mb-5 text-[18px] font-bold border-b border-gray-200">누적 수업 완료</h2>
                <div className="flex items-end gap-8 flex-wrap">
                    <p>
                        <strong className="text-4xl font-bold">{completedCount}</strong>
                        <span className="ml-1 text-gray-500">회</span>
                    </p>
                    <ul className="flex gap-2 flex-wrap">
                        {completedByLesson.map(({ id, name, count }) => (
                            <li key={id} className="px-3 py-1 bg-[#5980A6]/10 text-[#5980A6] text-[14px] font-bold">
                                {name} {count}회
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="mt-4 text-[13px] text-gray-500">주 선생님이 작성한 보고서만 완료 1회로 셉니다. 보충·온택트 선생님 보고서는 포함되지 않습니다.</p>
            </section>

            <section className="shadow-sm bg-white box-border p-6 border-t-4 border-[#5980A6]">
                <h2 className="text-[#5980A6] pb-4 mb-5 text-[18px] font-bold border-b border-gray-200">보고서 목록</h2>

                {reports.length === 0 ? (
                    <p className="py-10 text-center text-gray-400">아직 작성된 보고서가 없습니다.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {reports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}
