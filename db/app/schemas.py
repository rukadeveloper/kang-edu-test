from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

TeacherRole = Literal["main", "supplement", "ontact"]
"""주 선생님(main) / 보충 선생님(supplement) / 온택트 선생님(ontact)."""


class TeacherOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str | None = None
    is_ontact: bool | None = None
    role: TeacherRole


class TeacherCreate(BaseModel):
    name: str
    phone: str | None = None
    is_ontact: bool | None = None
    role: TeacherRole = "main"


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str | None = None


class StudentCreate(BaseModel):
    name: str
    phone: str | None = None


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    teacher_id: int | None = None
    teacher: TeacherOut | None = None
    lesson_type: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    report_content: str | None = None
    homework_content: str | None = None
    completion_weight: int = 0
    """주 선생님 보고서만 1, 보충/온택트 선생님 보고서는 0."""


class ReportCreate(BaseModel):
    student_id: int
    teacher_id: int | None = None
    lesson_type: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    report_content: str | None = None
    homework_content: str | None = None


class StudentReportSummary(BaseModel):
    student: StudentOut
    reports: list[ReportOut]
    total_count: int
    completed_count: int
