-- 개발용 데이터. TypeORM synchronize로 teachers, students, lessons 테이블이 생성된 뒤에 실행한다.
-- 실행: docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < seed.sql
-- 여러 번 실행해도 중복으로 들어가지 않는다.

-- crypt(..., gen_salt('bf'))는 bcrypt 해시($2a$...)를 만들고, bcryptjs.compare로 검증된다
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 모든 계정의 비밀번호는 12345
INSERT INTO teachers (name, phone, is_contact, email, password) VALUES
    ('테스트 선생님', '010-0000-0002', true,  'haruka135@naver.com',   crypt('12345', gen_salt('bf'))),
    ('김수학',        '010-0000-0003', false, 'teacher2@example.com', crypt('12345', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

INSERT INTO students (name, phone, email, password) VALUES
    ('테스트 학생', '010-0000-0001', 'harune135@naver.com',   crypt('12345', gen_salt('bf'))),
    ('이학생',      '010-0000-0004', 'student2@example.com', crypt('12345', gen_salt('bf'))),
    ('박학생',      '010-0000-0005', 'student3@example.com', crypt('12345', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

-- id는 DB가 랜덤 uuid로 생성한다. 같은 학생·선생님 조합이 이미 있으면 넣지 않아 중복을 막는다.
-- 학생·선생님 id도 자동 생성되므로 이메일로 찾아서 연결한다.
INSERT INTO lessons (name, student_id, main_teacher_id)
SELECT l.name, s.id, t.id
FROM (VALUES
    ('영어 회화',   'harune135@naver.com',   'haruka135@naver.com'),
    ('수학 정규반', 'harune135@naver.com',   'teacher2@example.com'),
    ('영어 문법',   'student2@example.com', 'haruka135@naver.com'),
    ('영어 회화',   'student3@example.com', 'haruka135@naver.com'),
    ('수학 심화반', 'student3@example.com', 'teacher2@example.com')
) AS l(name, student_email, teacher_email)
JOIN students s ON s.email = l.student_email
JOIN teachers t ON t.email = l.teacher_email
WHERE NOT EXISTS (
    SELECT 1 FROM lessons e
    WHERE e.student_id = s.id AND e.main_teacher_id = t.id
);

-- 예시 보고서. 주 선생님 / 온택트 선생님(is_contact) / 보충 선생님이 쓴 경우를 모두 포함한다.
-- 같은 수업·같은 시작 시각의 보고서가 이미 있으면 넣지 않는다.
-- 수업은 수업 이름 + 학생 이메일로, 작성 선생님은 이메일로 찾는다.
INSERT INTO reports (lesson_id, teacher_id, lesson_type, started_at, ended_at, report_content, homework_content)
SELECT l.id, t.id, r.lesson_type, r.started_at::timestamptz, r.ended_at::timestamptz, r.report_content, r.homework_content
FROM (VALUES
    ('영어 회화',   'harune135@naver.com',   'haruka135@naver.com',   '정규 수업', '2026-09-14 16:00+09', '2026-09-14 17:00+09', E'자기소개 표현을 연습했습니다.\n발음이 많이 좋아졌어요.', '자기소개 문장 5개 녹음해 오기'),
    ('영어 회화',   'harune135@naver.com',   'haruka135@naver.com',   '정규 수업', '2026-09-21 16:00+09', '2026-09-21 17:00+09', '취미에 대해 묻고 답하는 표현을 배웠습니다.', NULL),
    ('수학 정규반', 'harune135@naver.com',   'teacher2@example.com', '정규 수업', '2026-09-16 18:00+09', '2026-09-16 19:30+09', '이차방정식의 근의 공식을 유도하고 문제를 풀었습니다.', '교재 42~45쪽'),
    ('수학 정규반', 'harune135@naver.com',   'haruka135@naver.com',   '보강',      '2026-09-23 18:00+09', '2026-09-23 19:00+09', '김수학 선생님 대신 진도 복습을 진행했습니다.', NULL),
    ('영어 회화',   'harune135@naver.com',   'teacher2@example.com', '보강',      '2026-09-24 16:00+09', '2026-09-24 17:00+09', '테스트 선생님 대신 지난 수업 표현을 복습했습니다.', NULL),
    ('영어 문법',   'student2@example.com', 'haruka135@naver.com',   '정규 수업', '2026-09-15 15:00+09', '2026-09-15 16:00+09', '현재완료 시제를 배웠습니다.', '워크북 3단원'),
    ('수학 심화반', 'student3@example.com', 'teacher2@example.com', '특강',      '2026-09-19 10:00+09', '2026-09-19 12:00+09', '경시 대비 함수 문제를 풀었습니다.', NULL)
) AS r(lesson_name, student_email, teacher_email, lesson_type, started_at, ended_at, report_content, homework_content)
JOIN students s ON s.email = r.student_email
JOIN lessons l ON l.name = r.lesson_name AND l.student_id = s.id
JOIN teachers t ON t.email = r.teacher_email
WHERE NOT EXISTS (
    SELECT 1 FROM reports e
    WHERE e.lesson_id = l.id AND e.started_at = r.started_at::timestamptz
);
