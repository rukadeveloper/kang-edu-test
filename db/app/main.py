import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import report, student, teacher

load_dotenv()

app = FastAPI(title="kang-test API")

origins = os.environ.get("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teacher.router)
app.include_router(student.router)
app.include_router(report.router)


@app.get("/health")
def health():
    return {"status": "ok"}
