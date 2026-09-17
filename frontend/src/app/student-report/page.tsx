"use client";

import { useEffect, useState } from "react";
import FunctionTitle from "@/components/FunctionTitle";
import LoadingIndicator from "@/components/LoadingIndicator";
import { fetchStudentReports, fetchStudents } from "@/lib/api";
import { LESSON_TYPE_LABEL, LessonType, Student, StudentReportSummary, TEACHER_ROLE_LABEL } from "@/types/domain";

function formatDateTime(value: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function StudentReportPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] = useState("");
    const [summary, setSummary] = useState<StudentReportSummary | null>(null);
    const [loadedStudentId, setLoadedStudentId] = useState<string | null>(null);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [loadError, setLoadError] = useState("");

    const isLoadingSummary = studentId !== "" && loadedStudentId !== studentId;

    useEffect(() => {
        fetchStudents()
            .then((list) => {
                setStudents(list);
                if (list.length > 0) setStudentId(String(list[0].id));
            })
            .catch(() => setLoadError("학생 목록을 불러오지 못했습니다."))
            .finally(() => setIsLoadingStudents(false));
    }, []);

    useEffect(() => {
        if (!studentId) return;
        let ignore = false;

        fetchStudentReports(Number(studentId))
            .then((data) => {
                if (ignore) return;
                setSummary(data);
                setLoadedStudentId(studentId);
            })
            .catch(() => {
                if (ignore) return;
                setLoadError("보고서를 불러오지 못했습니다.");
                setLoadedStudentId(studentId);
            });

        return () => {
            ignore = true;
        };
    }, [studentId]);

    if (isLoadingStudents) {
        return (
            <div id="studentReportWrap" className="bg-[#F2F2F3] min-h-screen">
                <FunctionTitle title="학생 보고서 조회" />
                <LoadingIndicator label="학생 목록을 불러오는 중..." />
            </div>
        );
    }

    return (
        <div id="studentReportWrap" className="bg-[#F2F2F3] min-h-screen">
            <FunctionTitle title="학생 보고서 조회" />
            <div className="p-[20px]">
                {loadError && <p className="text-red-500 text-[14px] pb-[20px]">{loadError}</p>}

                <div id="studentSelect" className="flex items-center gap-[10px]">
                    <p className="w-[100px]">학생 선택</p>
                    <select
                        className="p-[10px] w-[200px] border border-black bg-white"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    >
                        {students.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoadingSummary && <LoadingIndicator label="보고서를 불러오는 중..." />}

                {!isLoadingSummary && summary && (
                    <>
                        <div id="completionSummary" className="mt-[20px] bg-white p-[20px] flex items-center gap-[30px]">
                            <div>
                                <p className="text-[14px] text-[#B2BBC5]">완료된 수업</p>
                                <p className="text-[26px]">
                                    {summary.completed_count}
                                    <span className="text-[16px] text-[#B2BBC5]"> / {summary.total_count}건</span>
                                </p>
                            </div>
                            <p className="text-[12px] text-[#5980A6]">
                                주 선생님이 작성한 보고서만 +1로 집계되며, 보충/온택트 선생님 보고서는 +0으로 집계됩니다.
                            </p>
                        </div>

                        <div id="reportList" className="mt-[20px] flex flex-col gap-[10px]">
                            {summary.reports.length === 0 && (
                                <p className="bg-white p-[20px] text-[14px] text-[#B2BBC5]">작성된 보고서가 없습니다.</p>
                            )}
                            {summary.reports.map((report) => (
                                <div key={report.id} className="bg-white p-[20px]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-[10px]">
                                            <span className="px-[10px] py-[4px] bg-[#F2F2F3] text-[12px]">
                                                {LESSON_TYPE_LABEL[(report.lesson_type as LessonType) ?? "regular"] ?? report.lesson_type}
                                            </span>
                                            <span className="text-[14px]">
                                                {report.teacher ? `${report.teacher.name} (${TEACHER_ROLE_LABEL[report.teacher.role]})` : "선생님 미지정"}
                                            </span>
                                        </div>
                                        <span
                                            className={`px-[10px] py-[4px] text-[12px] text-white ${
                                                report.completion_weight === 1 ? "bg-[#5980A6]" : "bg-[#B2BBC5]"
                                            }`}
                                        >
                                            {report.completion_weight === 1 ? "완료 +1" : "+0"}
                                        </span>
                                    </div>
                                    <p className="pt-[10px] text-[12px] text-[#B2BBC5]">
                                        {formatDateTime(report.started_at)} ~ {formatDateTime(report.ended_at)}
                                    </p>
                                    <div className="pt-[16px] border-t border-[#F2F2F3] mt-[16px]">
                                        <p className="text-[14px] text-[#B2BBC5]">보고서 내용</p>
                                        <p className="pt-[6px] text-[14px] whitespace-pre-wrap">{report.report_content}</p>
                                    </div>
                                    {report.homework_content && (
                                        <div className="pt-[16px]">
                                            <p className="text-[14px] text-[#B2BBC5]">숙제 내용</p>
                                            <p className="pt-[6px] text-[14px] whitespace-pre-wrap">{report.homework_content}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
