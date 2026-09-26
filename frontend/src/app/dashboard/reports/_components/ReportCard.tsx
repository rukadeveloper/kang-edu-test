import { Report } from "@/entities/Report";
import { getCompletionPoint, getReportWriterRole, reportWriterRoleLabels } from "@/lib/lessonCompletion";

// 수업 시각은 한국 시간 기준으로 저장·표시한다 (서버 시간대와 무관)
const dateFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
const timeFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false })

// 학생 화면에서는 본인 보고서만 보므로 학생 이름을 숨긴다
export default function ReportCard({ report, showStudent = false }: { report: Report, showStudent?: boolean }) {
    const writerRole = getReportWriterRole(report)
    const completionPoint = getCompletionPoint(report)

    return (
        <li className="border border-gray-200 p-5">
            <div className="flex items-center gap-3 flex-wrap mb-3">
                <h3 className="text-lg font-bold">{report.lesson.name}</h3>
                <span className="px-2 py-0.5 bg-[#5980A6] text-white text-[13px]">{report.lessonType}</span>
                <span className={`ml-auto px-2 py-0.5 text-[13px] font-bold ${completionPoint ? 'bg-[#5980A6]/10 text-[#5980A6]' : 'bg-gray-100 text-gray-500'}`}>
                    {reportWriterRoleLabels[writerRole]} · 완료 +{completionPoint}
                </span>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px] mb-4">
                {showStudent && (
                    <>
                        <dt className="text-gray-500">학생</dt>
                        <dd>{report.lesson.student.name}</dd>
                    </>
                )}
                <dt className="text-gray-500">수업 날짜</dt>
                <dd>{dateFormatter.format(report.startedAt)}</dd>
                <dt className="text-gray-500">수업 시간</dt>
                <dd>{timeFormatter.format(report.startedAt)} ~ {timeFormatter.format(report.endedAt)}</dd>
                <dt className="text-gray-500">작성 선생님</dt>
                <dd>{report.teacher.name} ({reportWriterRoleLabels[writerRole]})</dd>
            </dl>

            <div className="flex flex-col gap-3">
                <div>
                    <h4 className="font-bold mb-1">수업 내용</h4>
                    <p className="whitespace-pre-wrap text-[14px] text-gray-700">{report.reportContent}</p>
                </div>
                <div>
                    <h4 className="font-bold mb-1">숙제</h4>
                    <p className="whitespace-pre-wrap text-[14px] text-gray-700">{report.homeworkContent ?? '숙제가 없습니다.'}</p>
                </div>
            </div>
        </li>
    )
}
