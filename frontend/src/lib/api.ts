import type { Report, ReportCreate, Student, StudentReportSummary, Teacher } from "@/types/domain"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        ...init,
    })

    if (!res.ok) {
        throw new Error(`API 요청 실패 (${res.status}): ${path}`)
    }

    return res.json()
}

export function fetchTeachers(): Promise<Teacher[]> {
    return request("/teachers")
}

export function fetchStudents(): Promise<Student[]> {
    return request("/students")
}

export function fetchStudentReports(studentId: number): Promise<StudentReportSummary> {
    return request(`/students/${studentId}/reports`)
}

export function fetchReports(): Promise<Report[]> {
    return request("/reports")
}

export function createReport(payload: ReportCreate): Promise<Report> {
    return request("/reports", {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
