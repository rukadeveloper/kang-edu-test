from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.completion import completion_weight
from app.database import get_db

router = APIRouter(prefix="/reports", tags=["reports"])


def _to_report_out(report: models.Report) -> schemas.ReportOut:
    out = schemas.ReportOut.model_validate(report)
    out.completion_weight = completion_weight(report.teacher)
    return out


@router.get("", response_model=list[schemas.ReportOut])
def list_reports(student_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Report)
    if student_id is not None:
        query = query.filter(models.Report.student_id == student_id)
    reports = query.order_by(models.Report.id).all()
    return [_to_report_out(r) for r in reports]


@router.get("/{report_id}", response_model=schemas.ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.get(models.Report, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return _to_report_out(report)


@router.post("", response_model=schemas.ReportOut, status_code=201)
def create_report(payload: schemas.ReportCreate, db: Session = Depends(get_db)):
    report = models.Report(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return _to_report_out(report)
