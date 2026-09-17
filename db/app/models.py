from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Teacher(Base):
    __tablename__ = "Teacher"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str | None] = mapped_column(String)
    is_ontact: Mapped[bool | None] = mapped_column(Boolean)
    role: Mapped[str] = mapped_column(String, nullable=False, server_default="main")


class Student(Base):
    __tablename__ = "Student"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str | None] = mapped_column(String)


class Report(Base):
    __tablename__ = "Report"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    student_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("Student.id"), nullable=False)
    teacher_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("Teacher.id"))
    lesson_type: Mapped[str | None] = mapped_column(String)
    started_at: Mapped[object | None] = mapped_column(DateTime)
    ended_at: Mapped[object | None] = mapped_column(DateTime)
    report_content: Mapped[str | None] = mapped_column(Text)
    homework_content: Mapped[str | None] = mapped_column(Text)

    student: Mapped["Student"] = relationship()
    teacher: Mapped["Teacher"] = relationship()
