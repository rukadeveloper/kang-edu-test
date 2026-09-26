import { Report } from "@/entities/Report"

// 보고서를 쓴 선생님이 그 수업에서 어떤 역할인지
export type ReportWriterRole = 'main' | 'supplement' | 'ontact'

export const reportWriterRoleLabels: Record<ReportWriterRole, string> = {
    main: '주 선생님',
    supplement: '보충 선생님',
    ontact: '온택트 선생님',
}

type RoleSource = {
    teacherId?: string
    teacher: Pick<Report['teacher'], 'id' | 'isContact'>
    lesson: Pick<Report['lesson'], 'mainTeacherId'>
}

// 수업의 주 선생님(main_teacher_id)이 쓴 보고서가 '주 선생님' 보고서다.
// 그 외에는 온택트 선생님(is_contact)이면 '온택트', 아니면 '보충'
export function getReportWriterRole(report: RoleSource): ReportWriterRole {
    const writerId = report.teacher.id ?? report.teacherId
    if (writerId === report.lesson.mainTeacherId) return 'main'
    return report.teacher.isContact ? 'ontact' : 'supplement'
}

// 수업 완료 횟수: 주 선생님이 작성한 보고서만 +1, 보충·온택트 선생님 보고서는 +0
export function getCompletionPoint(report: RoleSource): 0 | 1 {
    return getReportWriterRole(report) === 'main' ? 1 : 0
}

export function countCompletedLessons(reports: RoleSource[]): number {
    return reports.reduce((sum, report) => sum + getCompletionPoint(report), 0)
}

// key별(수업별·학생별 등) 완료 횟수. 완료가 0회여도 목록에는 남긴다
export function countCompletedLessonsBy<T extends RoleSource>(reports: T[], getKey: (report: T) => { id: string, name: string }) {
    const counts = new Map<string, { name: string, count: number }>()
    for (const report of reports) {
        const { id, name } = getKey(report)
        counts.set(id, { name, count: (counts.get(id)?.count ?? 0) + getCompletionPoint(report) })
    }
    return [...counts.entries()].map(([id, value]) => ({ id, ...value }))
}
