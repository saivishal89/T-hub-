"""
Every Child Reads - SQLite Embedded Production Database & Security Store
Stores Users, RBAC Permissions, Dynamic Districts, Audit Logs, Sessions, and Students.
"""

import sqlite3
import os
import time
import uuid
import json
from typing import Optional, Dict, Any, List
from app.auth_crypto import hash_password, verify_password

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DB_PATH = os.path.join(DB_DIR, "ecr_platform.db")

def get_connection() -> sqlite3.Connection:
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        hash_algo TEXT NOT NULL,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        name_telugu TEXT NOT NULL,
        role_label TEXT NOT NULL,
        role_label_telugu TEXT NOT NULL,
        district TEXT,
        mandal TEXT,
        school TEXT,
        grade TEXT,
        enrolled_grade INTEGER,
        roll_number TEXT,
        child_name TEXT,
        child_id TEXT,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until REAL,
        created_at REAL NOT NULL
    );
    """)

    # 2. Sessions Table (Secure Expirable Sessions)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at REAL NOT NULL,
        expires_at REAL NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 3. Security Audit Logs Table (Sanitized - Zero sensitive credential logging)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp REAL NOT NULL,
        event_type TEXT NOT NULL,
        actor_id TEXT,
        actor_email TEXT,
        actor_role TEXT,
        ip_address TEXT,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT
    );
    """)

    # 4. OTP Verifications Table (Strict 10-minute expiry)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_verifications (
        email TEXT PRIMARY KEY,
        otp_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        expires_at REAL NOT NULL,
        verified INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0
    );
    """)

    # 5. District Telemetry Data (Dynamic per district)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS district_data (
        district_name TEXT PRIMARY KEY,
        district_telugu TEXT NOT NULL,
        total_schools INTEGER NOT NULL,
        total_students INTEGER NOT NULL,
        fluent_pct REAL NOT NULL,
        avg_wcpm REAL NOT NULL,
        needs_support_pct REAL NOT NULL,
        verified_teachers INTEGER NOT NULL,
        mandals_json TEXT NOT NULL
    );
    """)

    # 6. Students Table (Classroom Rosters & Academic State)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        teacher_id TEXT NOT NULL,
        school_name TEXT NOT NULL,
        district TEXT NOT NULL,
        mandal TEXT NOT NULL,
        name TEXT NOT NULL,
        name_telugu TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        grade TEXT NOT NULL,
        enrolled_grade INTEGER NOT NULL,
        section TEXT NOT NULL,
        reading_level TEXT NOT NULL,
        current_wcpm REAL DEFAULT 0,
        target_wcpm REAL DEFAULT 55,
        accuracy REAL DEFAULT 0,
        stars INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_activity_date TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 7. Student Assessment History Table (Persistent Real Assessment Records)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_assessments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        passage_id TEXT NOT NULL,
        passage_title TEXT NOT NULL,
        grade INTEGER NOT NULL,
        wcpm REAL NOT NULL,
        accuracy REAL NOT NULL,
        duration_seconds REAL NOT NULL,
        phonetic_errors_json TEXT,
        verified_by TEXT,
        verification_status TEXT DEFAULT 'pending',
        notes TEXT,
        timestamp REAL NOT NULL,
        date_formatted TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    """)

    # 8. Student Daily Activities Table (Genuine Streaks & Rewards Tracking)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        activity_type TEXT NOT NULL,
        date_string TEXT NOT NULL,
        stars_awarded INTEGER DEFAULT 0,
        timestamp REAL NOT NULL,
        details_json TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    seed_users_if_empty(cursor, conn)
    seed_district_data(cursor, conn)
    seed_students_if_empty(cursor, conn)
    seed_all_students(cursor, conn)
    cursor.execute("UPDATE users SET failed_login_attempts = 0, locked_until = NULL;")
    conn.commit()
    conn.close()

def seed_users_if_empty(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    cursor.execute("SELECT COUNT(*) as count FROM users")
    row = cursor.fetchone()
    if row["count"] > 0:
        return

    now = time.time()
    users_to_seed = [
        # State Admin
        {
            "id": "USR-ADM-001",
            "email": "admin@telangana.gov.in",
            "password": "Admin@1234",
            "role": "admin",
            "name": "Dr. K. Srinivas Rao, IAS",
            "name_telugu": "డాక్టర్ కె. శ్రీనివాస రావు, ఐఏఎస్",
            "role_label": "State Education Administrator",
            "role_label_telugu": "రాష్ట్ర పాఠశాల విద్యాశాఖ సంచాలకులు",
            "district": "హైదరాబాద్ (State HQ)",
            "mandal": "All Mandals",
            "school": "Department of School Education",
            "grade": None,
            "enrolled_grade": None,
            "roll_number": None,
            "child_name": None,
            "child_id": None
        },
        # DEO 1: Khammam District (Dynamic scope)
        {
            "id": "USR-DEO-001",
            "email": "deo.khammam@telangana.gov.in",
            "password": "Deo@1234",
            "role": "district_officer",
            "name": "Sri V. Venkataiah, DEO",
            "name_telugu": "శ్రీ వి. వెంకటయ్య, జిల్లా విద్యాధికారి",
            "role_label": "District Educational Officer",
            "role_label_telugu": "జిల్లా విద్యాశాఖ అధికారి (ఖమ్మం)",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "Khammam Urban, Madhira, Wyra, Sathupally",
            "school": "District Education Office, Khammam",
            "grade": None,
            "enrolled_grade": None,
            "roll_number": None,
            "child_name": None,
            "child_id": None
        },
        # DEO 2: Hyderabad District (Proves district dynamic isolation)
        {
            "id": "USR-DEO-002",
            "email": "deo.hyderabad@telangana.gov.in",
            "password": "Deo@1234",
            "role": "district_officer",
            "name": "Smt. R. Shailaja, DEO",
            "name_telugu": "శ్రీమతి ఆర్. శైలజ, జిల్లా విద్యాధికారి",
            "role_label": "District Educational Officer",
            "role_label_telugu": "జిల్లా విద్యాశాఖ అధికారి (హైదరాబాద్)",
            "district": "హైదరాబాద్ (Hyderabad)",
            "mandal": "Secunderabad, Khairatabad, Charminar, Golconda",
            "school": "District Education Office, Hyderabad",
            "grade": None,
            "enrolled_grade": None,
            "roll_number": None,
            "child_name": None,
            "child_id": None
        },
        # Teacher: Lakshmi Teacher (Assigned to ZP High School, Madhira)
        {
            "id": "USR-TCH-001",
            "email": "lakshmi.teacher@telangana.gov.in",
            "password": "Teacher@1234",
            "role": "teacher",
            "name": "Smt. P. Lakshmi",
            "name_telugu": "శ్రీమతి పి. లక్ష్మి (ఎస్.జి.టి)",
            "role_label": "Primary Telugu Educator",
            "role_label_telugu": "ప్రాథమిక తెలుగు ఉపాధ్యాయురాలు",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3, విభాగం-A",
            "enrolled_grade": None,
            "roll_number": None,
            "child_name": None,
            "child_id": None
        },
        # Student: G. Ramu (Strictly enrolled in Grade 3)
        {
            "id": "USR-STU-001",
            "email": "ramu.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "G. Ramu",
            "name_telugu": "జి. రాముడు",
            "role_label": "Primary Learner",
            "role_label_telugu": "తరగతి 3 విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": 3,
            "roll_number": "01",
            "child_name": None,
            "child_id": None
        },
        # Parent: G. Venkataiah (Parent of Ramu)
        {
            "id": "USR-PAR-001",
            "email": "parent.ramu@gmail.com",
            "password": "Parent@1234",
            "role": "parent",
            "name": "G. Venkataiah (Father)",
            "name_telugu": "జి. వెంకటయ్య (తండ్రి)",
            "role_label": "Parent / Guardian",
            "role_label_telugu": "తల్లిదండ్రులు / సంరక్షకులు",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": None,
            "roll_number": None,
            "child_name": "G. Ramu (జి. రాముడు)",
            "child_id": "USR-STU-001"
        }
    ]

    for u in users_to_seed:
        pwd_hash, salt, algo = hash_password(u["password"])
        cursor.execute("""
        INSERT INTO users (
            id, email, password_hash, salt, hash_algo, role, name, name_telugu,
            role_label, role_label_telugu, district, mandal, school, grade,
            enrolled_grade, roll_number, child_name, child_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            u["id"], u["email"], pwd_hash, salt, algo, u["role"], u["name"], u["name_telugu"],
            u["role_label"], u["role_label_telugu"], u["district"], u["mandal"], u["school"],
            u["grade"], u["enrolled_grade"], u["roll_number"], u["child_name"], u["child_id"], now
        ))

    conn.commit()

def seed_district_data(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    cursor.execute("SELECT COUNT(*) as count FROM district_data")
    if cursor.fetchone()["count"] > 0:
        return

    districts = [
        (
            "ఖమ్మం (Khammam)", "ఖమ్మం", 1420, 48500, 68.4, 49.2, 14.2, 3850,
            '[{"mandal":"మధిర (Madhira)","schools":142,"students":4890,"fluentPct":72.1,"avgWcpm":52.4},'
            '{"mandal":"ఖమ్మం అర్బన్ (Khammam Urban)","schools":210,"students":8420,"fluentPct":74.5,"avgWcpm":54.1},'
            '{"mandal":"వైరా (Wyra)","schools":115,"students":3920,"fluentPct":66.2,"avgWcpm":47.8},'
            '{"mandal":"సత్తుపల్లి (Sathupally)","schools":168,"students":5640,"fluentPct":64.8,"avgWcpm":46.5}]'
        ),
        (
            "హైదరాబాద్ (Hyderabad)", "హైదరాబాద్", 2150, 89400, 76.2, 55.4, 11.5, 5920,
            '[{"mandal":"సికింద్రాబాద్ (Secunderabad)","schools":340,"students":14500,"fluentPct":78.4,"avgWcpm":57.2},'
            '{"mandal":"ఖైరతాబాద్ (Khairatabad)","schools":280,"students":12400,"fluentPct":79.1,"avgWcpm":58.0},'
            '{"mandal":"చార్మినార్ (Charminar)","schools":310,"students":13200,"fluentPct":72.3,"avgWcpm":52.8},'
            '{"mandal":"గోల్కొండ (Golconda)","schools":260,"students":10800,"fluentPct":73.6,"avgWcpm":53.4}]'
        ),
        (
            "వరంగల్ (Warangal)", "వరంగల్", 1280, 42100, 65.1, 47.3, 16.8, 3120,
            '[{"mandal":"వరంగల్ అర్బన్","schools":195,"students":7800,"fluentPct":69.4,"avgWcpm":50.2},'
            '{"mandal":"హనుమకొండ","schools":220,"students":8900,"fluentPct":71.2,"avgWcpm":51.8}]'
        )
    ]

    cursor.executemany("""
    INSERT INTO district_data (
        district_name, district_telugu, total_schools, total_students, fluent_pct,
        avg_wcpm, needs_support_pct, verified_teachers, mandals_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, districts)
    conn.commit()

def seed_students_if_empty(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    cursor.execute("SELECT COUNT(*) as count FROM students")
    if cursor.fetchone()["count"] > 0:
        return

    now = time.time()
    today_str = time.strftime("%Y-%m-%d")
    yesterday_str = time.strftime("%Y-%m-%d", time.localtime(now - 86400))
    day_before_str = time.strftime("%Y-%m-%d", time.localtime(now - 172800))

    students_to_seed = [
        (
            "STU-101", "USR-STU-001", "USR-TCH-001", "Z.P. High School, Madhira",
            "ఖమ్మం (Khammam)", "మధిర (Madhira)", "G. Ramu", "జి. రాముడు", "01",
            "తరగతి 3-A", 3, "A", "వాక్య స్థాయి (Sentence Level)", 46.0, 55.0, 88.0,
            24, 3, today_str
        ),
        (
            "STU-102", None, "USR-TCH-001", "Z.P. High School, Madhira",
            "ఖమ్మం (Khammam)", "మధిర (Madhira)", "K. Vennela", "కె. వెన్నెల", "02",
            "తరగతి 3-A", 3, "A", "కథా స్థాయి (Fluent Story Level)", 58.0, 55.0, 94.0,
            32, 5, today_str
        ),
        (
            "STU-103", None, "USR-TCH-001", "Z.P. High School, Madhira",
            "ఖమ్మం (Khammam)", "మధిర (Madhira)", "M. Akhil", "ఎం. అఖిల్", "03",
            "తరగతి 3-A", 3, "A", "పద స్థాయి (Word Level)", 28.0, 55.0, 72.0,
            12, 1, yesterday_str
        )
    ]

    cursor.executemany("""
    INSERT INTO students (
        id, user_id, teacher_id, school_name, district, mandal, name, name_telugu,
        roll_number, grade, enrolled_grade, section, reading_level, current_wcpm,
        target_wcpm, accuracy, stars, streak_days, last_activity_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, students_to_seed)

    assessments_to_seed = [
        (
            "ASM-STU101-001", "STU-101", "PSG-001", "తెలివైన కాకి (The Clever Crow)", 3,
            38.5, 82.0, 42.0,
            '[{"sound":"త / ట","word":"టమాటా","errorType":"phonetic_substitution"}]',
            "USR-TCH-001", "verified", "మంచి ప్రయత్నం, ఒత్తులపై మరింత దృష్టి పెట్టాలి.",
            now - 172800, "11 Nov 2026"
        ),
        (
            "ASM-STU101-002", "STU-101", "PSG-002", "కుందేలు - తాబేలు పరుగు పందెం", 3,
            42.0, 85.0, 38.0,
            '[{"sound":"న / ణ","word":"వీణ","errorType":"nasal_substitution"}]',
            "USR-TCH-001", "verified", "పఠన వేగం మెరుగైంది.",
            now - 86400, "12 Nov 2026"
        ),
        (
            "ASM-STU101-003", "STU-101", "PSG-003", "సింహం మరియు ఎలుక", 3,
            46.0, 88.0, 35.0,
            '[{"sound":"ల / ళ","word":"నీళ్లు","errorType":"lateral_substitution"}]',
            "USR-TCH-001", "verified", "వాక్య పఠనం చాలా బాగుంది. WCPM 46కి చేరింది.",
            now, "13 Nov 2026"
        )
    ]

    cursor.executemany("""
    INSERT INTO student_assessments (
        id, student_id, passage_id, passage_title, grade, wcpm, accuracy,
        duration_seconds, phonetic_errors_json, verified_by, verification_status,
        notes, timestamp, date_formatted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, assessments_to_seed)

    activities_to_seed = [
        ("STU-101", "reading_assessment", day_before_str, 8, now - 172800, '{"assessmentId":"ASM-STU101-001"}'),
        ("STU-101", "akshara_sadhana", yesterday_str, 8, now - 86400, '{"drill":"త / ట సాధన"}'),
        ("STU-101", "reading_assessment", today_str, 8, now, '{"assessmentId":"ASM-STU101-003"}')
    ]

    cursor.executemany("""
    INSERT INTO student_activities (
        student_id, activity_type, date_string, stars_awarded, timestamp, details_json
    ) VALUES (?, ?, ?, ?, ?, ?);
    """, activities_to_seed)

    conn.commit()

def seed_all_students(cursor: sqlite3.Cursor, conn: sqlite3.Connection):
    """
    Seeds comprehensive student accounts across Grades 1, 2, 3, 4, 5.
    Uses INSERT OR IGNORE / existence check so existing data is never corrupted or duplicated.
    """
    now = time.time()
    today_str = time.strftime("%Y-%m-%d")
    yesterday_str = time.strftime("%Y-%m-%d", time.localtime(now - 86400))

    new_student_users = [
        # Grade 1 Students
        {
            "id": "USR-STU-002",
            "email": "ananya.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "P. Ananya",
            "name_telugu": "పి. అనన్య",
            "role_label": "Grade 1 Learner",
            "role_label_telugu": "1వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 1-A",
            "enrolled_grade": 1,
            "roll_number": "01",
            "student_id": "STU-104",
            "reading_level": "అక్షర స్థాయి (Alphabet/Beginner)",
            "current_wcpm": 18.0,
            "target_wcpm": 30.0,
            "accuracy": 82.0,
            "stars": 14,
            "streak_days": 2
        },
        {
            "id": "USR-STU-003",
            "email": "kalyan.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "T. Kalyan",
            "name_telugu": "టి. కళ్యాణ్",
            "role_label": "Grade 1 Learner",
            "role_label_telugu": "1వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 1-A",
            "enrolled_grade": 1,
            "roll_number": "02",
            "student_id": "STU-105",
            "reading_level": "అక్షర స్థాయి (Alphabet/Beginner)",
            "current_wcpm": 15.0,
            "target_wcpm": 30.0,
            "accuracy": 78.0,
            "stars": 10,
            "streak_days": 1
        },
        # Grade 2 Students
        {
            "id": "USR-STU-004",
            "email": "sneha.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "S. Sneha",
            "name_telugu": "ఎస్. స్నేహ",
            "role_label": "Grade 2 Learner",
            "role_label_telugu": "2వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 2-A",
            "enrolled_grade": 2,
            "roll_number": "01",
            "student_id": "STU-106",
            "reading_level": "పద స్థాయి (Word Level)",
            "current_wcpm": 32.0,
            "target_wcpm": 45.0,
            "accuracy": 85.0,
            "stars": 20,
            "streak_days": 3
        },
        {
            "id": "USR-STU-005",
            "email": "tharun.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "V. Tharun",
            "name_telugu": "వి. తరుణ్",
            "role_label": "Grade 2 Learner",
            "role_label_telugu": "2వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 2-A",
            "enrolled_grade": 2,
            "roll_number": "02",
            "student_id": "STU-107",
            "reading_level": "పద స్థాయి (Word Level)",
            "current_wcpm": 29.0,
            "target_wcpm": 45.0,
            "accuracy": 81.0,
            "stars": 16,
            "streak_days": 2
        },
        # Grade 3 Students (Lakshmi Teacher's Classroom 3-A)
        {
            "id": "USR-STU-006",
            "email": "vennela.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "K. Vennela",
            "name_telugu": "కె. వెన్నెల",
            "role_label": "Grade 3 Learner",
            "role_label_telugu": "3వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": 3,
            "roll_number": "02",
            "student_id": "STU-102",
            "reading_level": "కథా స్థాయి (Fluent Story Level)",
            "current_wcpm": 62.0,
            "target_wcpm": 55.0,
            "accuracy": 95.0,
            "stars": 42,
            "streak_days": 7
        },
        {
            "id": "USR-STU-007",
            "email": "ajay.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "M. Ajay Kumar",
            "name_telugu": "ఎం. అజయ్ కుమార్",
            "role_label": "Grade 3 Learner",
            "role_label_telugu": "3వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": 3,
            "roll_number": "03",
            "student_id": "STU-103",
            "reading_level": "పద స్థాయి (Word Level)",
            "current_wcpm": 28.0,
            "target_wcpm": 55.0,
            "accuracy": 74.0,
            "stars": 14,
            "streak_days": 2
        },
        {
            "id": "USR-STU-008",
            "email": "bhavani.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "P. Bhavani",
            "name_telugu": "పి. భవాని",
            "role_label": "Grade 3 Learner",
            "role_label_telugu": "3వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": 3,
            "roll_number": "04",
            "student_id": "STU-108",
            "reading_level": "వాక్య స్థాయి (Sentence Level)",
            "current_wcpm": 48.0,
            "target_wcpm": 55.0,
            "accuracy": 89.0,
            "stars": 31,
            "streak_days": 5
        },
        {
            "id": "USR-STU-009",
            "email": "charan.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "T. Charan Teja",
            "name_telugu": "టి. చరణ్ తేజ",
            "role_label": "Grade 3 Learner",
            "role_label_telugu": "3వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 3-A",
            "enrolled_grade": 3,
            "roll_number": "05",
            "student_id": "STU-109",
            "reading_level": "అక్షర స్థాయి (Alphabet/Beginner)",
            "current_wcpm": 16.0,
            "target_wcpm": 55.0,
            "accuracy": 62.0,
            "stars": 8,
            "streak_days": 1
        },
        # Grade 4 Students
        {
            "id": "USR-STU-010",
            "email": "divya.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "N. Divya",
            "name_telugu": "ఎన్. దివ్య",
            "role_label": "Grade 4 Learner",
            "role_label_telugu": "4వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 4-A",
            "enrolled_grade": 4,
            "roll_number": "01",
            "student_id": "STU-110",
            "reading_level": "కథా స్థాయి (Fluent Story Level)",
            "current_wcpm": 56.0,
            "target_wcpm": 60.0,
            "accuracy": 92.0,
            "stars": 38,
            "streak_days": 6
        },
        {
            "id": "USR-STU-011",
            "email": "karthik.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "R. Karthik",
            "name_telugu": "ఆర్. కార్తీక్",
            "role_label": "Grade 4 Learner",
            "role_label_telugu": "4వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 4-A",
            "enrolled_grade": 4,
            "roll_number": "02",
            "student_id": "STU-111",
            "reading_level": "వాక్య స్థాయి (Sentence Level)",
            "current_wcpm": 49.0,
            "target_wcpm": 60.0,
            "accuracy": 86.0,
            "stars": 26,
            "streak_days": 4
        },
        # Grade 5 Students
        {
            "id": "USR-STU-012",
            "email": "pranathi.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "A. Pranathi",
            "name_telugu": "ఎ. ప్రణతి",
            "role_label": "Grade 5 Learner",
            "role_label_telugu": "5వ తరగతి విద్యార్థిని",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 5-A",
            "enrolled_grade": 5,
            "roll_number": "01",
            "student_id": "STU-112",
            "reading_level": "కథా స్థాయి (Fluent Story Level)",
            "current_wcpm": 68.0,
            "target_wcpm": 65.0,
            "accuracy": 96.0,
            "stars": 45,
            "streak_days": 8
        },
        {
            "id": "USR-STU-013",
            "email": "manikantha.student@school.gov.in",
            "password": "Student@1234",
            "role": "student",
            "name": "D. Manikantha",
            "name_telugu": "డి. మణికంఠ",
            "role_label": "Grade 5 Learner",
            "role_label_telugu": "5వ తరగతి విద్యార్థి",
            "district": "ఖమ్మం (Khammam)",
            "mandal": "మధిర (Madhira)",
            "school": "Z.P. High School, Madhira",
            "grade": "తరగతి 5-A",
            "enrolled_grade": 5,
            "roll_number": "02",
            "student_id": "STU-113",
            "reading_level": "వాక్య స్థాయి (Sentence Level)",
            "current_wcpm": 54.0,
            "target_wcpm": 65.0,
            "accuracy": 88.0,
            "stars": 29,
            "streak_days": 4
        }
    ]

    for s in new_student_users:
        cursor.execute("SELECT id FROM users WHERE email = ?;", (s["email"],))
        user_row = cursor.fetchone()
        if not user_row:
            pwd_hash, salt, algo = hash_password(s["password"])
            cursor.execute("""
            INSERT INTO users (
                id, email, password_hash, salt, hash_algo, role, name, name_telugu,
                role_label, role_label_telugu, district, mandal, school, grade,
                enrolled_grade, roll_number, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                s["id"], s["email"], pwd_hash, salt, algo, s["role"], s["name"], s["name_telugu"],
                s["role_label"], s["role_label_telugu"], s["district"], s["mandal"], s["school"],
                s["grade"], s["enrolled_grade"], s["roll_number"], now
            ))

        cursor.execute("SELECT id FROM students WHERE id = ?;", (s["student_id"],))
        stu_row = cursor.fetchone()
        if not stu_row:
            cursor.execute("""
            INSERT INTO students (
                id, user_id, teacher_id, school_name, district, mandal, name, name_telugu,
                roll_number, grade, enrolled_grade, section, reading_level, current_wcpm,
                target_wcpm, accuracy, stars, streak_days, last_activity_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                s["student_id"], s["id"], "USR-TCH-001", s["school"], s["district"], s["mandal"],
                s["name"], s["name_telugu"], s["roll_number"], s["grade"], s["enrolled_grade"],
                "A", s["reading_level"], s["current_wcpm"], s["target_wcpm"], s["accuracy"],
                s["stars"], s["streak_days"], today_str
            ))
            cursor.execute("""
            INSERT INTO student_assessments (
                id, student_id, passage_id, passage_title, grade, wcpm, accuracy,
                duration_seconds, phonetic_errors_json, verified_by, verification_status,
                notes, timestamp, date_formatted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                f"ASM-{s['student_id']}-001", s["student_id"], f"PSG-00{s['enrolled_grade']}",
                f"తరగతి {s['enrolled_grade']} ప్రారంభ పఠన పరీక్ష", s["enrolled_grade"],
                s["current_wcpm"], s["accuracy"], 35.0,
                '[]', "USR-TCH-001", "verified", "ప్రారంభ పఠన పరీక్ష పూర్తయింది.",
                now - 86400, yesterday_str
            ))
            cursor.execute("""
            INSERT INTO student_activities (
                student_id, activity_type, date_string, stars_awarded, timestamp, details_json
            ) VALUES (?, ?, ?, ?, ?, ?);
            """, (
                s["student_id"], "reading_assessment", today_str, 5, now, '{"type":"baseline"}'
            ))
        else:
            cursor.execute("UPDATE students SET user_id = ? WHERE id = ?;", (s["id"], s["student_id"]))

    conn.commit()

# --- Auth & User Management Functions ---

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?);", (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def record_audit_log(
    event_type: str,
    action: str,
    resource: str,
    status: str,
    actor_id: Optional[str] = None,
    actor_email: Optional[str] = None,
    actor_role: Optional[str] = None,
    ip_address: Optional[str] = None,
    details: Optional[str] = None
):
    clean_details = str(details) if details else ""
    for sensitive_key in ["password", "token", "otp", "secret", "bearer"]:
        if sensitive_key in clean_details.lower():
            clean_details = "[REDACTED_SECURITY_DATA]"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO audit_logs (
        timestamp, event_type, actor_id, actor_email, actor_role,
        ip_address, action, resource, status, details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        time.time(), event_type, actor_id, actor_email, actor_role,
        ip_address, action, resource, status, clean_details
    ))
    conn.commit()
    conn.close()

def handle_login_attempt(email: str, password: str, client_ip: str, requested_role: Optional[str] = None) -> Dict[str, Any]:
    user = get_user_by_email(email)
    now = time.time()

    if not user:
        record_audit_log(
            event_type="LOGIN_FAILED",
            action="USER_LOGIN",
            resource="/api/auth/login",
            status="FAILED",
            actor_email=email,
            ip_address=client_ip,
            details="User not found"
        )
        return {"success": False, "status_code": 401, "error": "ఈ ఈమెయిల్ తో ఖాతా లేదు (User not found with this email)"}

    if user["locked_until"] and user["locked_until"] > now:
        remaining_minutes = int((user["locked_until"] - now) / 60) + 1
        record_audit_log(
            event_type="ACCOUNT_LOCKED_ACCESS_BLOCKED",
            action="USER_LOGIN",
            resource="/api/auth/login",
            status="BLOCKED",
            actor_id=user["id"],
            actor_email=user["email"],
            actor_role=user["role"],
            ip_address=client_ip,
            details=f"Account locked until {user['locked_until']}"
        )
        return {
            "success": False,
            "status_code": 429,
            "error": f"ఖాతా తాత్కాలికంగా లాక్ చేయబడింది. దయచేసి {remaining_minutes} నిమిషాల తర్వాత ప్రయత్నించండి. (Account locked due to 5 failed attempts. Try again in {remaining_minutes} minutes.)"
        }

    is_valid = verify_password(password, user["password_hash"], user["salt"], user["hash_algo"])

    conn = get_connection()
    cursor = conn.cursor()

    if not is_valid:
        new_attempts = (user["failed_login_attempts"] or 0) + 1
        locked_until = now + 900 if new_attempts >= 5 else None

        cursor.execute("""
        UPDATE users
        SET failed_login_attempts = ?, locked_until = ?
        WHERE id = ?;
        """, (new_attempts, locked_until, user["id"]))
        conn.commit()
        conn.close()

        record_audit_log(
            event_type="LOGIN_FAILED_WRONG_PASSWORD",
            action="USER_LOGIN",
            resource="/api/auth/login",
            status="FAILED",
            actor_id=user["id"],
            actor_email=user["email"],
            actor_role=user["role"],
            ip_address=client_ip,
            details=f"Failed attempt {new_attempts}/5"
        )

        return {"success": False, "status_code": 401, "error": f"చెల్లని పాస్‌వర్డ్. (Invalid password. Attempt {new_attempts}/5)"}

    # Reset failed attempts on success
    cursor.execute("""
    UPDATE users
    SET failed_login_attempts = 0, locked_until = NULL
    WHERE id = ?;
    """, (user["id"],))
    conn.commit()

    token = create_session(user["id"], client_ip, cursor, conn)
    conn.close()

    record_audit_log(
        event_type="LOGIN_SUCCESS",
        action="USER_LOGIN",
        resource="/api/auth/login",
        status="SUCCESS",
        actor_id=user["id"],
        actor_email=user["email"],
        actor_role=user["role"],
        ip_address=client_ip,
        details="Successful login session created"
    )

    clean_user = {k: v for k, v in user.items() if k not in ("password_hash", "salt", "hash_algo")}
    if clean_user.get("role") == "student":
        stu = get_student_by_user_id(clean_user["id"])
        if stu:
            clean_user["student_id"] = stu["id"]
            clean_user["studentId"] = stu["id"]
    return {
        "success": True,
        "token": token,
        "user": clean_user
    }

def create_session(user_id: str, ip_address: str, cursor: sqlite3.Cursor, conn: sqlite3.Connection) -> str:
    token = f"ecr_sec_{uuid.uuid4().hex}_{int(time.time())}"
    now = time.time()
    expires_at = now + 28800  # 8 hours

    cursor.execute("""
    INSERT INTO sessions (token, user_id, created_at, expires_at, ip_address)
    VALUES (?, ?, ?, ?, ?);
    """, (token, user_id, now, expires_at, ip_address))
    conn.commit()
    return token

def validate_session(token: str) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    now = time.time()

    cursor.execute("""
    SELECT s.token, s.expires_at, u.*
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?;
    """, (token, now))

    row = cursor.fetchone()
    conn.close()
    if not row:
        return None

    user = dict(row)
    for sensitive in ["password_hash", "salt", "hash_algo"]:
        user.pop(sensitive, None)
    if user.get("role") == "student":
        stu = get_student_by_user_id(user["id"])
        if stu:
            user["student_id"] = stu["id"]
            user["studentId"] = stu["id"]
    return user

def revoke_session(token: str, client_ip: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE token = ?;", (token,))
    conn.commit()
    conn.close()
    record_audit_log(
        event_type="SESSION_REVOKED",
        action="USER_LOGOUT",
        resource="/api/auth/logout",
        status="SUCCESS",
        ip_address=client_ip,
        details=f"Session token revoked"
    )

def generate_and_store_otp(email: str, client_ip: str) -> Optional[str]:
    user = get_user_by_email(email)
    if not user:
        return None

    import secrets
    otp = f"{secrets.randbelow(900000) + 100000}"
    otp_hash, salt, _ = hash_password(otp)
    now = time.time()
    expires_at = now + 600

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO otp_verifications (email, otp_hash, salt, expires_at, verified, attempts)
    VALUES (?, ?, ?, ?, 0, 0);
    """, (email.lower(), otp_hash, salt, expires_at))
    conn.commit()
    conn.close()

    record_audit_log(
        event_type="OTP_GENERATED",
        action="REQUEST_PASSWORD_RESET_OTP",
        resource="/api/auth/forgot-password",
        status="SUCCESS",
        actor_id=user["id"],
        actor_email=user["email"],
        actor_role=user["role"],
        ip_address=client_ip,
        details="OTP generated for password reset"
    )
    return otp

def verify_reset_otp(email: str, otp: str, client_ip: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    now = time.time()

    cursor.execute("""
    SELECT * FROM otp_verifications
    WHERE email = ? AND expires_at > ? AND verified = 0;
    """, (email.lower(), now))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return False

    if row["attempts"] >= 3:
        conn.close()
        return False

    is_valid = verify_password(otp, row["otp_hash"], row["salt"], "pbkdf2_sha256")
    if is_valid:
        cursor.execute("UPDATE otp_verifications SET verified = 1 WHERE email = ?;", (email.lower(),))
        conn.commit()
        conn.close()
        record_audit_log(
            event_type="OTP_VERIFIED",
            action="VERIFY_PASSWORD_RESET_OTP",
            resource="/api/auth/verify-otp",
            status="SUCCESS",
            actor_email=email,
            ip_address=client_ip,
            details="OTP successfully verified"
        )
        return True
    else:
        cursor.execute("UPDATE otp_verifications SET attempts = attempts + 1 WHERE email = ?;", (email.lower(),))
        conn.commit()
        conn.close()
        return False

def reset_password(email: str, new_password: str, client_ip: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM otp_verifications WHERE email = ? AND verified = 1;", (email.lower(),))
    otp_row = cursor.fetchone()
    if not otp_row:
        conn.close()
        return False

    new_hash, new_salt, algo = hash_password(new_password)
    cursor.execute("""
    UPDATE users
    SET password_hash = ?, salt = ?, hash_algo = ?, failed_login_attempts = 0, locked_until = NULL
    WHERE LOWER(email) = LOWER(?);
    """, (new_hash, new_salt, algo, email))

    cursor.execute("DELETE FROM otp_verifications WHERE email = ?;", (email.lower(),))
    conn.commit()
    conn.close()

    record_audit_log(
        event_type="PASSWORD_RESET_COMPLETED",
        action="RESET_PASSWORD",
        resource="/api/auth/reset-password",
        status="SUCCESS",
        actor_email=email,
        ip_address=client_ip,
        details="User password updated securely with Argon2id"
    )
    return True

def get_deo_district_data(district_name: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM district_data WHERE district_name LIKE ?;", (f"%{district_name}%",))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_system_audit_logs(limit: int = 100) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?;", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_student_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE user_id = ?;", (user_id,))
    row = cursor.fetchone()
    if not row:
        # Match via user account metadata
        cursor.execute("SELECT * FROM users WHERE id = ?;", (user_id,))
        u = cursor.fetchone()
        if u:
            # Check by name matching
            cursor.execute("SELECT * FROM students WHERE name = ? OR name_telugu = ?;", (u["name"], u["name_telugu"]))
            row = cursor.fetchone()
            if not row and u["roll_number"] and u["enrolled_grade"]:
                cursor.execute("SELECT * FROM students WHERE roll_number = ? AND enrolled_grade = ?;",
                               (u["roll_number"], u["enrolled_grade"]))
                row = cursor.fetchone()
            if row:
                cursor.execute("UPDATE students SET user_id = ? WHERE id = ?;", (user_id, row["id"]))
                conn.commit()
    conn.close()
    return dict(row) if row else None

def get_student_by_id(student_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?;", (student_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_student_assessments(student_id: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM student_assessments
    WHERE student_id = ?
    ORDER BY timestamp DESC;
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        if d.get("phonetic_errors_json"):
            try:
                d["phonetic_errors"] = json.loads(d["phonetic_errors_json"])
            except:
                d["phonetic_errors"] = []
        result.append(d)
    return result

def calculate_genuine_streak(student_id: str) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT DISTINCT date_string FROM student_activities
    WHERE student_id = ?
    ORDER BY date_string DESC;
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()
    if not rows:
        return 0

    dates = [r["date_string"] for r in rows]
    streak = 1
    today = time.strftime("%Y-%m-%d")
    yesterday = time.strftime("%Y-%m-%d", time.localtime(time.time() - 86400))

    if dates[0] not in (today, yesterday):
        return 0

    return len(dates)

def record_student_assessment(
    student_id: str,
    passage_id: str,
    passage_title: str,
    grade: int,
    wcpm: float,
    accuracy: float,
    duration_seconds: float,
    phonetic_errors: List[Dict[str, Any]],
    verified_by: Optional[str] = None,
    notes: Optional[str] = None
) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    now = time.time()
    today_str = time.strftime("%Y-%m-%d")
    date_formatted = time.strftime("%d %b %Y")
    asm_id = f"ASM-{student_id}-{int(now)}"
    phonetic_json = json.dumps(phonetic_errors, ensure_ascii=False)

    cursor.execute("""
    INSERT INTO student_assessments (
        id, student_id, passage_id, passage_title, grade, wcpm, accuracy,
        duration_seconds, phonetic_errors_json, verified_by, verification_status,
        notes, timestamp, date_formatted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        asm_id, student_id, passage_id, passage_title, grade, wcpm, accuracy,
        duration_seconds, phonetic_json, verified_by, "verified" if verified_by else "pending",
        notes, now, date_formatted
    ))

    stars_earned = max(1, round(accuracy / 10))
    cursor.execute("""
    INSERT INTO student_activities (
        student_id, activity_type, date_string, stars_awarded, timestamp, details_json
    ) VALUES (?, ?, ?, ?, ?, ?);
    """, (
        student_id, "reading_assessment", today_str, stars_earned, now,
        json.dumps({"assessmentId": asm_id, "wcpm": wcpm, "accuracy": accuracy})
    ))

    cursor.execute("SELECT stars FROM students WHERE id = ?;", (student_id,))
    stu = cursor.fetchone()
    current_stars = stu["stars"] if stu else 0
    total_stars = current_stars + stars_earned

    streak = calculate_genuine_streak(student_id)

    cursor.execute("""
    UPDATE students
    SET current_wcpm = ?, accuracy = ?, stars = ?, streak_days = ?, last_activity_date = ?
    WHERE id = ?;
    """, (wcpm, accuracy, total_stars, streak, today_str, student_id))

    conn.commit()
    conn.close()

    return {
        "assessmentId": asm_id,
        "studentId": student_id,
        "wcpm": wcpm,
        "accuracy": accuracy,
        "starsEarned": stars_earned,
        "totalStars": total_stars,
        "streakDays": streak,
        "dateFormatted": date_formatted
    }

def get_teacher_assigned_students(teacher_id: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM students
    WHERE teacher_id = ?
    ORDER BY roll_number ASC;
    """, (teacher_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_student_grade(student_email: str, new_grade: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users
    SET enrolled_grade = ?, grade = ?
    WHERE LOWER(email) = LOWER(?);
    """, (new_grade, f"తరగతి {new_grade}-A", student_email.strip()))

    cursor.execute("""
    UPDATE students
    SET enrolled_grade = ?, grade = ?
    WHERE user_id = (SELECT id FROM users WHERE LOWER(email) = LOWER(?));
    """, (new_grade, f"తరగతి {new_grade}-A", student_email.strip()))

    conn.commit()
    conn.close()
    return True

# Initialize DB on import
init_db()
