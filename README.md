# 수업 보고서 시스템

선생님이 수업 보고서를 작성하고, 학생과 선생님이 각자 관련된 보고서와 누적 수업 완료 횟수를 확인하는 웹 애플리케이션입니다.

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack, `cacheComponents`), React 19 |
| 언어 / 스타일 | TypeScript, Tailwind CSS 4 |
| DB / ORM | PostgreSQL 18 (Docker), TypeORM |
| 인증 | JWT (`jose`), 비밀번호 bcrypt 해시 (`bcryptjs`) |

## 폴더 구조

```
kang-edu-test/
├── db/
│   ├── docker-compose.yml     # PostgreSQL 컨테이너
│   └── seed.sql               # 개발용 계정·수업·보고서 데이터
└── frontend/
    └── src/
        ├── instrumentation.ts     # 서버 시작 시 DB 초기화
        ├── proxy.ts               # 로그인 여부에 따른 페이지 접근 제어
        ├── entities/              # Teacher, Student, Lesson, Report
        ├── repositories/          # 테이블 접근 레이어
        ├── lib/
        │   ├── database.ts        # TypeORM DataSource
        │   ├── auth.ts            # 로그인 사용자 조회 (getAuthUser)
        │   ├── lessonCompletion.ts# 수업 완료 횟수 계산 로직
        │   └── reportOptions.ts   # 수업 종류 목록
        └── app/
            ├── login/                         # 로그인
            ├── server-actions/                # 로그인·로그아웃, 보고서 저장
            └── dashboard/reports/
                ├── (common)/write/            # 보고서 작성 (선생님)
                ├── teachers/                  # 보고서 조회 (선생님)
                ├── students/                  # 보고서 확인 (학생)
                └── _components/ReportCard.tsx # 보고서 카드 (공통)
```

## 실행 방법

Node.js와 Docker가 필요합니다.

### 1. 환경 변수 설정

`.env` 파일은 Git에 포함되지 않으므로 직접 만들어야 합니다. 아래 값은 예시입니다.

`db/.env`

```env
POSTGRES_USER=kang
POSTGRES_PASSWORD=kang1234
POSTGRES_DB=kang_edu
POSTGRES_PORT=5432
```

`frontend/.env`

```env
JWT_SECRET=충분히-긴-임의의-문자열
DATABASE_URL=postgresql://kang:kang1234@localhost:5432/kang_edu
NODE_ENV=development
```

`DATABASE_URL`의 사용자·비밀번호·포트·DB 이름은 `db/.env`와 같아야 합니다.

### 2. DB 실행

```bash
cd db
docker compose up -d
```

`POSTGRES_*` 값으로 사용자와 DB가 만들어지는 것은 볼륨이 비어 있는 **최초 실행 때뿐**입니다. 나중에 값을 바꾸려면 `docker compose down -v`로 볼륨까지 지운 뒤 다시 실행해야 하며, 이때 기존 데이터도 함께 지워집니다.

### 3. 앱 실행

```bash
cd frontend
npm install
npm run dev
```

서버가 시작될 때 `instrumentation.ts`가 DB에 연결하고, 개발 모드에서는 TypeORM `synchronize`가 엔티티를 기준으로 테이블을 만들거나 수정합니다.

### 4. 개발용 데이터 넣기

테이블이 만들어진 뒤(3번 이후)에 실행합니다.

```bash
cd db
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < seed.sql
```

여러 번 실행해도 데이터가 중복으로 들어가지 않습니다.

### 5. 접속

http://localhost:3000 에 접속하면 로그인 화면으로 이동합니다.

## 테스트 계정

모든 계정의 비밀번호는 `12345`입니다.

| 구분 | 이메일 | 이름 | 비고 |
|---|---|---|---|
| 선생님 | haruka135@naver.com | 테스트 선생님 | 온택트 선생님(`is_contact = true`) |
| 선생님 | teacher2@example.com | 김수학 | |
| 학생 | harune135@naver.com | 테스트 학생 | 보고서가 가장 많은 계정 |
| 학생 | student2@example.com | 이학생 | |
| 학생 | student3@example.com | 박학생 | |

## 데이터 모델

```
teachers ──< lessons >── students
   │            │
   └──< reports >┘
```

| 테이블 | 주요 컬럼 | 설명 |
|---|---|---|
| `teachers` | `id`, `name`, `phone`, `is_contact`, `email`, `password` | 선생님. `is_contact`는 온택트 선생님 여부 |
| `students` | `id`, `name`, `phone`, `email`, `password` | 학생 |
| `lessons` | `id`, `name`, `student_id`, `main_teacher_id` | 수업. 학생 1명과 주 선생님 1명으로 이루어짐 |
| `reports` | `id`, `lesson_id`, `teacher_id`, `lesson_type`, `started_at`, `ended_at`, `report_content`, `homework_content` | 수업 보고서. `teacher_id`는 보고서를 **작성한** 선생님이며 수업의 주 선생님과 다를 수 있음 |

- 모든 `id`는 uuid입니다.
- `teachers`, `students`에는 로그인용 `email`, `password`(bcrypt 해시)와 토큰 컬럼 `accessToken`, `refreshToken`이 있습니다.
- `started_at`, `ended_at`은 `timestamptz`로 저장하며, 입력과 표시는 한국 시간 기준입니다.

## 주요 기능

### 로그인 · 접근 제어

- 이메일로 `teachers`, `students` 테이블을 함께 조회해 역할(`teacher` / `student`)을 판단합니다.
- 로그인에 성공하면 `sub`(사용자 id), `email`, `role`을 담은 JWT를 `httpOnly` 쿠키(`authToken`, 7일)로 발급합니다.
- `proxy.ts`가 토큰이 없거나 유효하지 않으면 `/login`으로 보냅니다.
- 역할에 따라 사이드바 메뉴가 다르게 나옵니다. 보고서 조회 페이지와 보고서 저장(서버 액션)에서도 역할을 다시 확인합니다.

### 보고서 작성 (선생님) — `/dashboard/reports/write`

| 영역 | 항목 |
|---|---|
| 기본 정보 | 수업 선택, 담당 선생님(기본값: 로그인한 선생님), 수업 날짜, 수업 종류 |
| 수업 시간 | 시작 시간, 종료 시간 (06:00~23:50, 10분 단위) |
| 수업 내용 | 수업 내용(필수), 숙제(선택) |

- 선택 목록과 달력은 브라우저 기본 `select`, `input[type=date]` 대신 직접 만든 컴포넌트(`Select`, `DatePicker`)를 씁니다. 키보드 조작을 지원합니다.
- 저장은 서버 액션(`createReport`)과 `useActionState`로 처리합니다. 서버에서 모든 값을 다시 검증하며, 종료 시간이 시작 시간보다 이르면 저장하지 않습니다.
- 저장에 성공하면 폼이 비워지고, 실패하면 작성한 내용이 그대로 남습니다. 초기화 버튼으로 처음 상태로 되돌릴 수 있습니다.

### 보고서 확인 (학생) — `/dashboard/reports/students`

- 로그인한 학생의 수업에 달린 보고서만 최근 수업 순으로 보여줍니다.
- 보고서마다 수업 이름, 수업 종류, 날짜, 시간, 작성 선생님과 그 역할, 수업 내용, 숙제를 보여줍니다.
- 누적 수업 완료 횟수와 수업별 완료 횟수를 보여줍니다.

### 보고서 조회 (선생님) — `/dashboard/reports/teachers`

- 로그인한 선생님이 직접 작성한 보고서와, 담당 수업(주 선생님인 수업)에 달린 보고서를 함께 보여줍니다.
- 전체 보고서 수, 직접 작성한 보고서 수, 학생별 완료 횟수를 보여줍니다.

### 수업 완료 횟수 계산

**주 선생님이 작성한 보고서만 +1**, 보충 선생님과 온택트 선생님이 작성한 보고서는 +0입니다.

보고서를 쓴 선생님의 역할은 아래 순서로 판정합니다.

| 순서 | 조건 | 역할 | 완료 횟수 |
|---|---|---|---|
| 1 | 작성 선생님이 그 수업의 `main_teacher_id` | 주 선생님 | +1 |
| 2 | 그 외, 작성 선생님이 `is_contact = true` | 온택트 선생님 | +0 |
| 3 | 그 외 | 보충 선생님 | +0 |

- 계산은 `src/lib/lessonCompletion.ts` 한 곳에서만 하며, 학생·선생님 페이지가 같은 함수를 씁니다.
- 보고서 카드에 `주 선생님 · 완료 +1`처럼 표시해 어떤 보고서가 횟수에 들어갔는지 확인할 수 있습니다.
- seed 기준으로 테스트 학생은 보고서 5개 중 주 선생님 보고서 3개만 세어 **누적 3회**입니다.

## 구현 메모

- **서버 시작 시 DB 초기화**: `instrumentation.ts`의 `register()`가 서버가 요청을 받기 전에 DB 연결과 테이블 동기화를 끝냅니다.
- **레포지토리는 테이블 이름으로 조회**: Next.js가 `instrumentation.ts`와 앱 코드를 서로 다른 번들로 만들기 때문에 엔티티 클래스가 두 벌 생깁니다. TypeORM은 클래스를 객체 동일성으로만 찾으므로 `getRepository(User)` 대신 `getRepository('users')`처럼 테이블 이름을 씁니다. 새 레포지토리를 만들 때도 이 방식을 따라야 합니다.
- **`cacheComponents` 대응**: DB를 조회하는 페이지는 맨 앞에서 `await connection()`을 호출해 조회가 요청 시점에만 실행되게 합니다. 각 보고서 경로에는 `loading.tsx`를 두어 페이지 간 이동 중에도 헤더를 먼저 보여줍니다.
- **보고서 폼 제출**: `<form action>`을 쓰면 React가 제출 후 폼을 무조건 비워서 검증에 실패해도 작성 내용이 사라집니다. 그래서 `onSubmit`에서 `startTransition`으로 액션을 호출하고, 성공했을 때만 폼을 비웁니다.

## 알려진 제한 사항

- 테이블 생성은 개발 모드의 `synchronize`에 의존합니다. 마이그레이션 파일이 없으므로 프로덕션(`next build` / `next start`)에서는 테이블이 자동으로 만들어지지 않습니다.
- 엔티티를 수정한 뒤에는 dev 서버를 재시작해야 반영됩니다. 이미 데이터가 있는 테이블에 필수 컬럼을 추가하면 `synchronize`가 실패하므로 기존 행을 먼저 채워야 합니다.
- 보고서 목록은 한 번에 모두 불러오며 페이지 나누기가 없습니다.
- 수업 종류(`정규 수업`, `보강`, `특강`, `상담`)는 예시 값입니다.
- 이메일 중복은 테이블마다 따로 검사합니다. 같은 이메일이 선생님과 학생에 모두 있으면 선생님으로 로그인됩니다.
