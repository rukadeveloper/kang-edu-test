from app import models

MAIN_TEACHER_ROLE = "main"


def completion_weight(teacher: "models.Teacher | None") -> int:
    """주 선생님이 작성한 보고서만 수업 완료로 +1 처리하고, 보충/온택트 선생님은 +0."""
    if teacher is not None and teacher.role == MAIN_TEACHER_ROLE:
        return 1
    return 0
