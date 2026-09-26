'use server'

import { getAuthUser } from "@/lib/auth"
import { lessonTypes } from "@/lib/reportOptions"
import { ReportRepository } from "@/repositories/ReportRepository"

export interface ReportState {
    success: boolean
    message: string
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^\d{2}:\d{2}$/

// 수업 시각은 한국 시간 기준으로 입력받으므로 +09:00을 붙여 서버 시간대와 무관하게 해석한다
function toKstDate(date: string, time: string) {
    return new Date(`${date}T${time}:00+09:00`)
}

export async function createReport(prevState: ReportState, formData: FormData): Promise<ReportState> {
    const user = await getAuthUser()

    if (user.role !== 'teacher') return { success: false, message: '선생님만 보고서를 작성할 수 있습니다.' }

    const lessonId = formData.get('lessonId') as string
    const teacherId = formData.get('teacherId') as string
    const lessonDate = formData.get('lessonDate') as string
    const lessonType = formData.get('lessonType') as string
    const startedTime = formData.get('startedTime') as string
    const endedTime = formData.get('endedTime') as string
    const reportContent = (formData.get('reportContent') as string ?? '').trim()
    const homeworkContent = (formData.get('homeworkContent') as string ?? '').trim()

    if (!uuidPattern.test(lessonId ?? '')) return { success: false, message: '수업을 선택하세요.' }
    if (!uuidPattern.test(teacherId ?? '')) return { success: false, message: '담당 선생님을 선택하세요.' }
    if (!datePattern.test(lessonDate ?? '')) return { success: false, message: '수업 날짜를 선택하세요.' }
    if (!lessonTypes.includes(lessonType)) return { success: false, message: '수업 종류를 선택하세요.' }
    if (!timePattern.test(startedTime ?? '') || !timePattern.test(endedTime ?? '')) return { success: false, message: '수업 시간을 선택하세요.' }

    const startedAt = toKstDate(lessonDate, startedTime)
    const endedAt = toKstDate(lessonDate, endedTime)

    if (Number.isNaN(startedAt.getTime()) || Number.isNaN(endedAt.getTime())) return { success: false, message: '수업 날짜나 시간이 올바르지 않습니다.' }
    if (endedAt <= startedAt) return { success: false, message: '종료 시간은 시작 시간보다 늦어야 합니다.' }
    if (!reportContent) return { success: false, message: '수업 내용을 입력하세요.' }

    try {
        await ReportRepository.create({
            lessonId,
            teacherId,
            lessonType,
            startedAt,
            endedAt,
            reportContent,
            homeworkContent: homeworkContent || null,
        })
    } catch (error) {
        // 없는 수업·선생님 id(FK 위반) 등 DB 오류
        console.error(error)
        return { success: false, message: '보고서를 저장하지 못했습니다. 다시 시도해 주세요.' }
    }

    return { success: true, message: '보고서를 저장했습니다.' }
}
