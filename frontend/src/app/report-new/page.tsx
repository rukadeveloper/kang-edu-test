"use client";

import { useEffect, useState } from "react";
import FunctionTitle from "@/components/FunctionTitle";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createReport, fetchStudents, fetchTeachers } from "@/lib/api";
import { LESSON_TYPE_LABEL, LessonType, Student, TEACHER_ROLE_LABEL, Teacher } from "@/types/domain";

export default function ReportNewPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [studentId, setStudentId] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [lessonType, setLessonType] = useState<LessonType>("regular");
    const [startedAt, setStartedAt] = useState("");
    const [endedAt, setEndedAt] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [homeworkContent, setHomeworkContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([fetchTeachers(), fetchStudents()])
            .then(([teacherList, studentList]) => {
                setTeachers(teacherList);
                setStudents(studentList);
                if (studentList.length > 0) setStudentId(String(studentList[0].id));
                if (teacherList.length > 0) setTeacherId(String(teacherList[0].id));
            })
            .catch(() => setLoadError("학생/선생님 목록을 불러오지 못했습니다."))
            .finally(() => setIsLoading(false));
    }, []);

    const selectedTeacher = teachers.find((t) => String(t.id) === teacherId);

    const resetForm = () => {
        setLessonType("regular");
        setStartedAt("");
        setEndedAt("");
        setReportContent("");
        setHomeworkContent("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!studentId || !teacherId || !startedAt || !endedAt || !reportContent) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createReport({
                student_id: Number(studentId),
                teacher_id: Number(teacherId),
                lesson_type: lessonType,
                started_at: new Date(startedAt).toISOString(),
                ended_at: new Date(endedAt).toISOString(),
                report_content: reportContent,
                homework_content: homeworkContent || null,
            });
            alert("보고서가 저장되었습니다.");
            resetForm();
        } catch {
            alert("보고서 저장에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div id="reportNewWrap" className="bg-[#F2F2F3] min-h-screen">
                <FunctionTitle title="보고서 작성" />
                <LoadingIndicator label="학생/선생님 정보를 불러오는 중..." />
            </div>
        );
    }

    return (
        <div id="reportNewWrap" className="bg-[#F2F2F3] min-h-screen">
            <FunctionTitle title="보고서 작성" />
            <form id="writeArea" className="p-[20px]" onSubmit={handleSubmit}>
                {loadError && <p className="text-red-500 text-[14px] pb-[20px]">{loadError}</p>}

                <div id="mainInfoWriteArea" className="bg-white p-[20px]">
                    <h2 className="pb-[20px] border-b border-black">기본 정보</h2>

                    <div id="studentSelect" className="pt-[20px] flex items-center gap-[10px]">
                        <p className="w-[100px]">학생 선택</p>
                        <select
                            className="p-[10px] w-[200px] border border-black"
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

                    <div id="teacherSelect" className="pt-[20px] flex items-center gap-[10px]">
                        <p className="w-[100px]">작성 선생님</p>
                        <select
                            className="p-[10px] w-[200px] border border-black"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        >
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({TEACHER_ROLE_LABEL[t.role]})
                                </option>
                            ))}
                        </select>
                        {selectedTeacher && (
                            <p className="text-[12px] text-[#5980A6]">
                                {selectedTeacher.role === "main"
                                    ? "수업 완료 +1 처리됩니다."
                                    : "수업 완료 집계에는 반영되지 않습니다 (+0)."}
                            </p>
                        )}
                    </div>

                    <div id="classTypeSelect" className="pt-[20px] flex items-center gap-[10px]">
                        <p className="w-[100px]">수업 종류</p>
                        <select
                            className="p-[10px] w-[200px] border border-black"
                            value={lessonType}
                            onChange={(e) => setLessonType(e.target.value as LessonType)}
                        >
                            {(Object.keys(LESSON_TYPE_LABEL) as LessonType[]).map((key) => (
                                <option key={key} value={key}>
                                    {LESSON_TYPE_LABEL[key]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div id="classTimeSelect" className="pt-[20px] flex items-center gap-[10px]">
                        <p className="w-[100px]">수업 시간</p>
                        <input
                            type="datetime-local"
                            className="p-[10px] border border-black"
                            value={startedAt}
                            onChange={(e) => setStartedAt(e.target.value)}
                        />
                        <span>~</span>
                        <input
                            type="datetime-local"
                            className="p-[10px] border border-black"
                            value={endedAt}
                            onChange={(e) => setEndedAt(e.target.value)}
                        />
                    </div>
                </div>

                <div id="contentWriteArea" className="bg-white p-[20px] mt-[20px]">
                    <h2 className="pb-[20px] border-b border-black">내용 작성</h2>

                    <div id="reportContentWrite" className="pt-[20px] flex flex-col gap-[10px]">
                        <p>보고서 내용</p>
                        <textarea
                            className="p-[10px] h-[150px] border border-black resize-none"
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                        />
                    </div>

                    <div id="homeworkContentWrite" className="pt-[20px] flex flex-col gap-[10px]">
                        <p>숙제 내용</p>
                        <textarea
                            className="p-[10px] h-[100px] border border-black resize-none"
                            value={homeworkContent}
                            onChange={(e) => setHomeworkContent(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer mt-[20px] px-[30px] py-[14px] bg-[#5980A6] text-white disabled:opacity-50"
                >
                    {isSubmitting ? "저장 중..." : "보고서 저장"}
                </button>
            </form>
        </div>
    );
}
