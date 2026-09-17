export type TeacherRole = "main" | "supplement" | "ontact"

export const TEACHER_ROLE_LABEL: Record<TeacherRole, string> = {
    main: "주 선생님",
    supplement: "보충 선생님",
    ontact: "온택트 선생님",
}

export type Teacher = {
    id: number
    name: string
    phone: string | null
    is_ontact: boolean | null
    role: TeacherRole
}

export type Student = {
    id: number
    name: string
    phone: string | null
}

export type LessonType = "regular" | "makeup" | "special"

export const LESSON_TYPE_LABEL: Record<LessonType, string> = {
    regular: "정규 수업",
    makeup: "보강",
    special: "특강",
}

export type Report = {
    id: number
    student_id: number
    teacher_id: number | null
    teacher: Teacher | null
    lesson_type: string | null
    started_at: string | null
    ended_at: string | null
    report_content: string | null
    homework_content: string | null
    completion_weight: number
}

export type ReportCreate = {
    student_id: number
    teacher_id: number | null
    lesson_type: string | null
    started_at: string | null
    ended_at: string | null
    report_content: string | null
    homework_content: string | null
}

export type StudentReportSummary = {
    student: Student
    reports: Report[]
    total_count: number
    completed_count: number
}
