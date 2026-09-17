from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.completion import completion_weight
from app.database import get_db

router = APIRouter(prefix="/students", tags=["students"])


@router.get("", response_model=list[schemas.StudentOut])
def list_students(db: Session = Depends(get_db)):
    return db.query(models.Student).order_by(models.Student.id).all()


@router.get("/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(models.Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post("", response_model=schemas.StudentOut, status_code=201)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    student = models.Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}/reports", response_model=schemas.StudentReportSummary)
def get_student_reports(student_id: int, db: Session = Depends(get_db)):
    student = db.get(models.Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    reports = (
        db.query(models.Report)
        .filter(models.Report.student_id == student_id)
        .order_by(models.Report.started_at.desc(), models.Report.id.desc())
        .all()
    )

    report_outs: list[schemas.ReportOut] = []
    completed_count = 0
    for report in reports:
        weight = completion_weight(report.teacher)
        completed_count += weight
        out = schemas.ReportOut.model_validate(report)
        out.completion_weight = weight
        report_outs.append(out)

    return schemas.StudentReportSummary(
        student=schemas.StudentOut.model_validate(student),
        reports=report_outs,
        total_count=len(report_outs),
        completed_count=completed_count,
    )
