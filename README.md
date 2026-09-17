# kang-test

수업 보고서 작성/조회 및 수업 완료 현황을 관리하는 시스템입니다.

- `db/` — FastAPI 백엔드 (SQLAlchemy + Supabase Postgres)
- `frontend/` — Next.js 프론트엔드

## 실행 방법

### 백엔드 (`db/`)

```bash
cd db
python -m venv .venv
./.venv/Scripts/activate      # Windows
pip install -r requirements.txt
```

`db/.env` 파일 생성:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
CORS_ORIGINS=http://localhost:3000
```

서버 실행:

```bash
uvicorn app.main:app --reload --port 8000
```

`http://localhost:8000/health` 응답이 `{"status":"ok"}`이면 정상입니다.

### 프론트엔드 (`frontend/`)

```bash
cd frontend
npm install
```

`frontend/.env.local` 파일 생성:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

개발 서버 실행:

```bash
npm run dev
```

`http://localhost:3000` 접속 후 로그인이 필요합니다 (`LoginMockProvider`의 mock 계정 사용, 학생/교사 계정에 따라 보이는 메뉴가 다릅니다).

## 테이블 구조

### Teacher (선생님)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigint (PK) | |
| name | string | 이름 |
| phone | string \| null | |
| is_ontact | boolean \| null | 레거시 컬럼 (아래 `role`로 대체) |
| role | string | `main`(주 선생님) / `supplement`(보충 선생님) / `ontact`(온택트 선생님) |

### Student (학생)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigint (PK) | |
| name | string | 이름 |
| phone | string \| null | |

### Report (수업 보고서)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigint (PK) | |
| student_id | bigint (FK → Student.id) | 대상 학생 |
| teacher_id | bigint \| null (FK → Teacher.id) | 작성한 선생님 |
| lesson_type | string \| null | 수업 종류 (`regular`/`makeup`/`special`) |
| started_at / ended_at | datetime \| null | 수업 시작/종료 시각 |
| report_content | text \| null | 보고서 내용 |
| homework_content | text \| null | 숙제 내용 |

`Report`는 `Teacher`, `Student`와 각각 다대일(N:1) 관계입니다.

## 수업 완료 횟수 계산 방식

기준 로직은 `db/app/completion.py`의 `completion_weight(teacher)`에 있습니다.

- 보고서를 작성한 선생님의 `role`이 **`main`(주 선생님)** 이면 **+1**
- `supplement`(보충 선생님), `ontact`(온택트 선생님)이 작성한 보고서는 **+0**

집계 흐름:

1. `GET /reports`, `GET /reports/{id}` 응답에는 보고서별로 이 값이 `completion_weight` 필드로 포함됩니다.
2. `GET /students/{id}/reports`는 해당 학생의 전체 보고서 목록과 함께
   - `total_count`: 전체 보고서 수
   - `completed_count`: `completion_weight` 합계 (= 주 선생님이 작성한 보고서 수)
   를 함께 반환합니다.
3. 프론트엔드의 홈 대시보드(`/`)와 학생 보고서 조회 페이지(`/student-report`)는 이 값을 그대로 사용해 "완료된 수업 / 총 보고서 수"를 보여줍니다.
