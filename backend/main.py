"""
Every Child Reads: Telugu AI Assessment - FastAPI Application Entrypoint
Provides native FastAPI ASGI compatibility for Vercel Serverless & Services deployment.
"""

import os
import sys
import asyncio
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Request, Response, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.db import (
    init_db,
    handle_login_attempt,
    validate_session,
    revoke_session,
    generate_and_store_otp,
    verify_reset_otp,
    reset_password,
    get_deo_district_data,
    get_system_audit_logs,
    record_audit_log,
    get_connection,
    get_student_by_user_id,
    get_student_by_id,
    get_student_assessments,
    record_student_assessment,
    get_teacher_assigned_students,
    calculate_genuine_streak
)
from app.services.telugu_speech_engine import TeluguSpeechEngine
from app.services.telugu_asr_service import TeluguASRAlignmentService
from server import generate_edge_tts, RATE_LIMITER

# Initialize DB Schema
init_db()

app = FastAPI(
    title="Every Child Reads Telugu AI Platform",
    description="Government School Telugu AI Literacy Assessment Platform API",
    version="3.2.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_session(request: Request):
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1].strip()
    if not token:
        cookie_header = request.headers.get("Cookie", "")
        for part in cookie_header.split(";"):
            part = part.strip()
            if part.startswith("session_token="):
                token = part.split("=")[1].strip()
                break
    if not token:
        return None, None
    user = validate_session(token)
    return token, user

@app.get("/")
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Every Child Reads Telugu AI REST API"}

@app.get("/api/auth/me")
async def get_current_user(request: Request):
    token, user = extract_session(request)
    if user:
        return {"authenticated": True, "user": user}
    return JSONResponse(status_code=401, content={"authenticated": False, "error": "Unauthorized session or expired"})

@app.post("/api/auth/login")
async def login(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    payload = await request.json()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    requested_role = payload.get("role", "")

    login_result = handle_login_attempt(
        email=email,
        password=password,
        client_ip=client_ip,
        requested_role=requested_role
    )

    if not login_result["success"]:
        return JSONResponse(status_code=login_result["status_code"], content={"error": login_result["error"]})

    response = JSONResponse(content={
        "message": "Login successful",
        "token": login_result["token"],
        "user": login_result["user"]
    })
    response.set_cookie(
        key="session_token",
        value=login_result["token"],
        max_age=28800,
        httponly=True,
        samesite="strict",
        path="/"
    )
    return response

@app.post("/api/auth/logout")
async def logout(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    token, user = extract_session(request)
    if token:
        revoke_session(token, client_ip)
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="session_token", path="/")
    return response

@app.post("/api/auth/forgot-password")
async def forgot_password(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    payload = await request.json()
    email = payload.get("email", "").strip().lower()
    otp = generate_and_store_otp(email, client_ip)
    if otp:
        return {"message": "రక్షణ కోడ్ (OTP) మీ అధికారిక ఈమెయిల్‌కు పంపబడింది. (OTP sent to registered email)", "otpSent": True}
    return JSONResponse(status_code=404, content={"error": "ఈ ఈమెయిల్ తో ఖాతా లేదు (Account not found with this email)"})

@app.post("/api/auth/verify-otp")
async def verify_otp(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    payload = await request.json()
    email = payload.get("email", "").strip().lower()
    otp = payload.get("otp", "").strip()
    verified = verify_reset_otp(email, otp, client_ip)
    if verified:
        return {"message": "OTP verified successfully", "verified": True}
    return JSONResponse(status_code=400, content={"error": "చెల్లని లేదా గడువు ముగిసిన OTP (Invalid or expired OTP)", "verified": False})

@app.post("/api/auth/reset-password")
async def reset_pass(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    payload = await request.json()
    email = payload.get("email", "").strip().lower()
    new_password = payload.get("newPassword", "")
    if len(new_password) < 8:
        return JSONResponse(status_code=400, content={"error": "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి (Password must be at least 8 characters)"})
    success = reset_password(email, new_password, client_ip)
    if success:
        return {"message": "పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది. (Password successfully updated)", "reset": True}
    return JSONResponse(status_code=400, content={"error": "OTP ధృవీకరణ అవసరం లేదా గడువు ముగిసింది. (OTP verification required or expired)"})

@app.get("/api/deo/dashboard")
async def deo_dashboard(request: Request, district: Optional[str] = ""):
    client_ip = request.client.host if request.client else "127.0.0.1"
    token, user = extract_session(request)
    if not user or user.get("role") not in ("district_officer", "admin"):
        return JSONResponse(status_code=403, content={"error": "Access denied: DEO or Admin role required"})
    assigned_district = user.get("district", "")
    if user.get("role") == "district_officer" and district:
        if district.lower() not in assigned_district.lower() and assigned_district.lower() not in district.lower():
            return JSONResponse(status_code=403, content={"error": f"అధీకృత అనుమతి లేదు: మీరు కేటాయించిన జిల్లా '{assigned_district}'కి మాత్రమే పరిమితం.", "assignedDistrict": assigned_district})
    district_to_fetch = district if (user.get("role") == "admin" and district) else assigned_district
    clean_search = "Khammam" if "khammam" in district_to_fetch.lower() else ("Hyderabad" if "hyderabad" in district_to_fetch.lower() else "Warangal")
    deo_data = get_deo_district_data(clean_search)
    return {"districtTelemetry": deo_data}

@app.get("/api/audit-logs")
async def audit_logs(request: Request):
    token, user = extract_session(request)
    if not user or user.get("role") != "admin":
        return JSONResponse(status_code=403, content={"error": "Access denied: Only system administrators can inspect audit logs."})
    logs = get_system_audit_logs(limit=100)
    return {"auditLogs": logs}

@app.get("/api/passages")
async def passages(request: Request, grade: Optional[int] = 0):
    token, user = extract_session(request)
    if user and user.get("role") == "student":
        enrolled = user.get("enrolledGrade", 3)
        if grade and grade != enrolled:
            return JSONResponse(status_code=403, content={"error": f"అధీకృత అనుమతి లేదు: మీరు {enrolled}వ తరగతికి మాత్రమే పరిమితం.", "enrolledGrade": enrolled})
    return {"grade": grade or (user.get("enrolledGrade") if user else 3), "status": "authorized"}

@app.get("/api/student/history")
async def student_history(request: Request, studentId: Optional[str] = ""):
    token, user = extract_session(request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized session"})
    if user.get("role") == "student":
        student = get_student_by_user_id(user["id"])
        if not student:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM students WHERE name = ? OR name_telugu = ?;", (user.get("name"), user.get("name_telugu")))
            row = cursor.fetchone()
            conn.close()
            student = dict(row) if row else None
        if not student:
            return JSONResponse(status_code=404, content={"error": "Student profile record not found"})
        student_id = student["id"]
    elif user.get("role") == "parent":
        child_id = user.get("childId")
        student = get_student_by_user_id(child_id) if child_id else None
        if not student:
            return JSONResponse(status_code=404, content={"error": "Child profile not found"})
        student_id = student["id"]
    else:
        student = get_student_by_id(studentId) if studentId else None
        if not student:
            return JSONResponse(status_code=404, content={"error": "Student record not found"})
        student_id = student["id"]

    assessments = get_student_assessments(student_id)
    streak = calculate_genuine_streak(student_id)
    return {
        "student": student,
        "streakDays": streak,
        "assessments": assessments,
        "totalAssessments": len(assessments)
    }

@app.get("/api/students")
async def list_students(request: Request):
    token, user = extract_session(request)
    if not user or user.get("role") not in ("teacher", "admin", "district_officer"):
        return JSONResponse(status_code=403, content={"error": "Access denied: Educator or administrator role required."})
    if user.get("role") == "teacher":
        students = get_teacher_assigned_students(user["id"])
    else:
        conn = get_connection()
        cursor = conn.cursor()
        if user.get("role") == "district_officer":
            assigned_dist = user.get("district", "Khammam")
            clean_dist = "Khammam" if "khammam" in assigned_dist.lower() else "Hyderabad"
            cursor.execute("SELECT * FROM students WHERE district LIKE ? ORDER BY roll_number ASC;", (f"%{clean_dist}%",))
        else:
            cursor.execute("SELECT * FROM students ORDER BY roll_number ASC;")
        students = [dict(r) for r in cursor.fetchall()]
        conn.close()
    return {"students": students}

@app.get("/api/tts")
async def tts_endpoint(text: str = Query(...), persona: str = "lakshmi", slow: bool = False):
    if not text.strip():
        return JSONResponse(status_code=400, content={"error": "Missing text parameter"})
    try:
        audio_bytes = await generate_edge_tts(text.strip(), persona=persona, slow=slow)
        return Response(content=audio_bytes, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to synthesize Telugu speech"})

@app.post("/api/assess")
async def assess(request: Request):
    payload = await request.json()
    passage_id = payload.get("passageId", "PSG-001")
    passage_title = payload.get("passageTitle", "తెలివైన కాకి")
    grade = int(payload.get("grade", 3))
    duration = float(payload.get("durationSeconds", 35.0))
    ref_text = payload.get("referenceText", "")
    spoken_text = payload.get("spokenText", "")

    if spoken_text:
        result = TeluguASRAlignmentService.align_and_evaluate(
            reference_text=ref_text,
            spoken_text=spoken_text,
            duration_seconds=duration
        )
        result["passageId"] = passage_id
        result["passageTitle"] = passage_title
        result["grade"] = grade
    else:
        result = TeluguSpeechEngine.evaluate_reading(
            passage_id=passage_id,
            passage_title=passage_title,
            grade=grade,
            ref_text=ref_text,
            spoken_text=spoken_text,
            duration_seconds=duration
        )
    return result

@app.post("/api/tutor/evaluate")
async def tutor_evaluate(request: Request):
    payload = await request.json()
    target_word = payload.get("targetWord", "")
    spoken_text = payload.get("spokenText", "")
    voice_persona = payload.get("voicePersona", "lakshmi")
    if not target_word:
        return JSONResponse(status_code=400, content={"error": "Target word is required"})
    result = TeluguSpeechEngine.evaluate_tutor_interaction(
        target_word=target_word,
        spoken_audio_text=spoken_text,
        voice_persona=voice_persona
    )
    return result

@app.post("/api/student/assessment")
async def save_student_assessment(request: Request):
    token, caller = extract_session(request)
    if not caller:
        return JSONResponse(status_code=401, content={"error": "Authentication required to record assessment"})
    payload = await request.json()
    if caller.get("role") == "student":
        student_record = get_student_by_user_id(caller["id"])
        if not student_record:
            return JSONResponse(status_code=404, content={"error": "Student profile not found"})
        student_id = student_record["id"]
    else:
        student_id = payload.get("studentId")
        if not student_id:
            student_record = get_student_by_user_id(caller["id"])
            student_id = student_record["id"] if student_record else "STU-101"

    passage_id = payload.get("passageId", "PSG-001")
    passage_title = payload.get("passageTitle", "తెలుగు కథ")
    grade = int(payload.get("grade", 3))
    wcpm = float(payload.get("wcpm", 0.0))
    accuracy = float(payload.get("accuracy", 0.0))
    duration = float(payload.get("durationSeconds", 30.0))
    phonetic_errors = payload.get("phoneticErrors", [])
    notes = payload.get("notes", "")

    saved_record = record_student_assessment(
        student_id=student_id,
        passage_id=passage_id,
        passage_title=passage_title,
        grade=grade,
        wcpm=wcpm,
        accuracy=accuracy,
        duration_seconds=duration,
        phonetic_errors=phonetic_errors,
        verified_by=caller.get("id", "AI_SYSTEM"),
        notes=notes
    )
    return {"message": "Assessment recorded and saved to persistent database.", "assessment": saved_record}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
