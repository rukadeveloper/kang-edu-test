import { connection } from "next/server";
import FormBox from "./_components/FormBox";
import Select from "./_components/Select";
import DatePicker from "./_components/DatePicker";
import ReportForm from "./_components/ReportForm";
import { lessonTypes } from "@/lib/reportOptions";
import { getAuthUser } from "@/lib/auth";
import { LessonRepository } from "@/repositories/LessonRepository";
import { TeacherRepository } from "@/repositories/TeacherRepository";


// 06:00 ~ 23:50, 10분 단위
const timeOptions = Array.from({ length: (24 - 6) * 6 }, (_, index) => {
    const hour = String(6 + Math.floor(index / 6)).padStart(2, '0')
    const minute = String((index % 6) * 10).padStart(2, '0')
    const time = `${hour}:${minute}`
    return { value: time, label: time }
})

const textareaClassName = "w-full min-h-[160px] p-3 bg-white border border-gray-300 resize-y focus:outline-none focus:border-[#5980A6]"

export default async function WritePage() {
    // DB 조회(pg·typeorm 내부의 Date.now() 등)는 요청 시점에만 실행되도록 프리렌더를 여기서 멈춘다
    await connection()

    const [user, lessons, teachers] = await Promise.all([
        getAuthUser(),
        LessonRepository.findAllWithStudent(),
        TeacherRepository.findAll(),
    ])

    // 로그인한 선생님을 담당 선생님 기본값으로 둔다
    const defaultTeacherId = user.role === 'teacher' ? user.sub ?? '' : ''

    const basicTypeArr = [
        {
            id: 1,
            name: '수업 선택',
            htmlFor: 'lessonId',
            field: (
                <Select
                    id="lessonId"
                    name="lessonId"
                    placeholder="수업을 선택하세요"
                    required
                    // 같은 이름의 수업을 구분할 수 있도록 학생 이름을 붙인다
                    options={lessons.map((lesson) => ({ value: lesson.id, label: `${lesson.name} · ${lesson.student.name}` }))}
                />
            )
        },
        {
            id: 2,
            name: '담당 선생님',
            htmlFor: 'teacherId',
            field: (
                <Select
                    id="teacherId"
                    name="teacherId"
                    placeholder="선생님을 선택하세요"
                    defaultValue={defaultTeacherId}
                    required
                    options={teachers.map((teacher) => ({ value: teacher.id, label: teacher.name }))}
                />
            )
        },
        {
            id: 3,
            name: '수업 날짜',
            htmlFor: 'lessonDate',
            field: <DatePicker id="lessonDate" name="lessonDate" placeholder="날짜를 선택하세요" required />
        },
        {
            id: 4,
            name: '수업 종류',
            htmlFor: 'lessonType',
            field: (
                <Select
                    id="lessonType"
                    name="lessonType"
                    placeholder="수업 종류를 선택하세요"
                    required
                    options={lessonTypes.map((lessonType) => ({ value: lessonType, label: lessonType }))}
                />
            )
        }
    ]

    const timeTypeArr = [
        {
            id: 1,
            name: '시작 시간',
            htmlFor: 'startedTime',
            field: <Select id="startedTime" name="startedTime" placeholder="시작 시간을 선택하세요" required options={timeOptions} />
        },
        {
            id: 2,
            name: '종료 시간',
            htmlFor: 'endedTime',
            field: <Select id="endedTime" name="endedTime" placeholder="종료 시간을 선택하세요" required options={timeOptions} />
        }
    ]

    const contentTypeArr = [
        {
            id: 1,
            name: '수업 내용',
            htmlFor: 'reportContent',
            field: <textarea id="reportContent" name="reportContent" placeholder="오늘 진행한 수업 내용을 입력하세요" required className={textareaClassName} />
        },
        {
            id: 2,
            name: '숙제',
            htmlFor: 'homeworkContent',
            field: <textarea id="homeworkContent" name="homeworkContent" placeholder="숙제가 없으면 비워 두세요" className={textareaClassName} />
        }
    ]

    return (
        <div className="formWrapper p-7 box-border h-[calc(100vh-100px)] overflow-y-auto">
            <ReportForm>
                <div className="contentsWrapper grid grid-cols-[2fr_1fr] gap-5">
                    <FormBox title={"기본 정보"} typeArr={basicTypeArr} />
                    <FormBox title={"수업 시간"} typeArr={timeTypeArr} columns={1} />
                    <FormBox title={"수업 내용"} typeArr={contentTypeArr} columns={1} className="col-span-2" />
                </div>
            </ReportForm>
        </div>
    )
}
