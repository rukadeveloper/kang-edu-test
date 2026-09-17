"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardAside from "@/components/DashboardAside";
import FunctionTitle from "@/components/FunctionTitle";
import LoadingIndicator from "@/components/LoadingIndicator";
import RequireAuth from "@/components/RequireAuth";
import { fetchReports, fetchStudents, fetchTeachers } from "@/lib/api";
import { Report, Student, TEACHER_ROLE_LABEL, Teacher } from "@/types/domain";

function formatDate(value: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white p-[20px]">
            <p className="text-[14px] text-[#B2BBC5]">{label}</p>
            <p className="text-[26px] mt-[6px]">{value}</p>
        </div>
    );
}

export default function Home() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        Promise.all([fetchTeachers(), fetchStudents(), fetchReports()])
            .then(([teacherList, studentList, reportList]) => {
                setTeachers(teacherList);
                setStudents(studentList);
                setReports(reportList);
            })
            .catch(() => setLoadError("대시보드 데이터를 불러오지 못했습니다."))
            .finally(() => setIsLoading(false));
    }, []);

    const completedCount = useMemo(
        () => reports.reduce((sum, r) => sum + r.completion_weight, 0),
        [reports]
    );

    const teacherStats = useMemo(
        () =>
            teachers
                .map((teacher) => ({
                    teacher,
                    reportCount: reports.filter((r) => r.teacher_id === teacher.id).length,
                }))
                .sort((a, b) => b.reportCount - a.reportCount),
        [teachers, reports]
    );

    const studentStats = useMemo(
        () =>
            students
                .map((student) => {
                    const studentReports = reports.filter((r) => r.student_id === student.id);
                    const completed = studentReports.reduce((sum, r) => sum + r.completion_weight, 0);
                    return { student, total: studentReports.length, completed };
                })
                .sort((a, b) => b.total - a.total),
        [students, reports]
    );

    const recentReports = useMemo(
        () =>
            [...reports]
                .filter((r) => r.started_at)
                .sort((a, b) => new Date(b.started_at as string).getTime() - new Date(a.started_at as string).getTime())
                .slice(0, 5),
        [reports]
    );

    if (isLoading) {
        return (
            <RequireAuth>
                <div className="layout flex">
                    <DashboardAside />
                    <main className="flex-1 bg-[#F2F2F3] min-h-screen">
                        <FunctionTitle title="작성현황 대시보드" />
                        <LoadingIndicator label="대시보드 데이터를 불러오는 중..." />
                    </main>
                </div>
            </RequireAuth>
        );
    }

    return (
        <RequireAuth>
            <div className="layout flex">
                <DashboardAside />
                <main className="flex-1 bg-[#F2F2F3] min-h-screen">
                    <FunctionTitle title="작성현황 대시보드" />
                    <div className="p-[20px]">
                        {loadError && <p className="text-red-500 text-[14px] pb-[20px]">{loadError}</p>}

                        <div id="summaryCards" className="grid grid-cols-4 gap-[16px]">
                            <StatCard label="총 학생" value={`${students.length}명`} />
                            <StatCard label="총 선생님" value={`${teachers.length}명`} />
                            <StatCard label="총 보고서" value={`${reports.length}건`} />
                            <StatCard label="완료 수업" value={`${completedCount}건`} />
                        </div>

                        <div className="grid grid-cols-2 gap-[16px] mt-[20px]">
                            <section className="bg-white p-[20px]">
                                <h2 className="pb-[16px] border-b border-black">선생님별 작성 현황</h2>
                                <ul className="mt-[16px] flex flex-col gap-[10px]">
                                    {teacherStats.map(({ teacher, reportCount }) => (
                                        <li key={teacher.id} className="flex items-center justify-between text-[14px]">
                                            <span>
                                                {teacher.name}{" "}
                                                <span className="text-[12px] text-[#B2BBC5]">
                                                    ({TEACHER_ROLE_LABEL[teacher.role]})
                                                </span>
                                            </span>
                                            <span>{reportCount}건</span>
                                        </li>
                                    ))}
                                    {teacherStats.length === 0 && (
                                        <p className="text-[14px] text-[#B2BBC5]">등록된 선생님이 없습니다.</p>
                                    )}
                                </ul>
                            </section>

                            <section className="bg-white p-[20px]">
                                <h2 className="pb-[16px] border-b border-black">학생별 수업 완료 현황</h2>
                                <ul className="mt-[16px] flex flex-col gap-[14px]">
                                    {studentStats.map(({ student, total, completed }) => (
                                        <li key={student.id} className="text-[14px]">
                                            <div className="flex items-center justify-between">
                                                <span>{student.name}</span>
                                                <span>
                                                    {completed} / {total}건
                                                </span>
                                            </div>
                                            <div className="mt-[6px] h-[6px] bg-[#F2F2F3]">
                                                <div
                                                    className="h-full bg-[#5980A6]"
                                                    style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                    {studentStats.length === 0 && (
                                        <p className="text-[14px] text-[#B2BBC5]">등록된 학생이 없습니다.</p>
                                    )}
                                </ul>
                            </section>
                        </div>

                        <section className="bg-white p-[20px] mt-[20px]">
                            <h2 className="pb-[16px] border-b border-black">최근 작성된 보고서</h2>
                            <ul className="mt-[16px] flex flex-col gap-[10px]">
                                {recentReports.map((report) => {
                                    const student = students.find((s) => s.id === report.student_id);
                                    return (
                                        <li key={report.id} className="flex items-center justify-between text-[14px]">
                                            <span>
                                                {student?.name ?? "알 수 없음"} - {report.teacher?.name ?? "선생님 미지정"}
                                            </span>
                                            <span className="text-[12px] text-[#B2BBC5]">{formatDate(report.started_at)}</span>
                                        </li>
                                    );
                                })}
                                {recentReports.length === 0 && (
                                    <p className="text-[14px] text-[#B2BBC5]">작성된 보고서가 없습니다.</p>
                                )}
                            </ul>
                        </section>
                    </div>
                </main>
            </div>
        </RequireAuth>
    );
}
