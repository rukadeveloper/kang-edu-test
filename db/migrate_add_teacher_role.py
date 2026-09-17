"""One-off migration: add Teacher.role ('main' | 'supplement' | 'ontact')."""

from sqlalchemy import text

from app.database import engine

with engine.begin() as conn:
    conn.execute(text('ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS role VARCHAR'))
    conn.execute(
        text(
            """
            UPDATE "Teacher"
            SET role = CASE WHEN is_ontact THEN 'ontact' ELSE 'main' END
            WHERE role IS NULL
            """
        )
    )
    conn.execute(text("ALTER TABLE \"Teacher\" ALTER COLUMN role SET DEFAULT 'main'"))
    conn.execute(text('ALTER TABLE "Teacher" ALTER COLUMN role SET NOT NULL'))

print("Migration complete.")
