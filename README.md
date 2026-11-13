# ప్రతి బిడ్డ చదవాలి (Every Child Reads) – Telugu AI Literacy Platform
### TISC Problem Statement 06 – Government-School-Focused Telugu Literacy & AI Reading Assessment SaaS

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![Compliance](https://img.shields.io/badge/Compliance-FLN_%2F_NIPUN_Bharat-138808)](#)

---

## 🌟 Major System Improvements & Architectural Overview

The application features **completely separate role panels, authentic email/password authentication with strict RBAC, Docker containerization, and an advanced Telugu AI voice and conversational reading tutor**.

### 1. 🛡️ Completely Separated Role Experiences
Users no longer share a single common dashboard. Each role has its own dedicated experience, navigation, theme, and data isolation:

- **👑 Admin Panel (`/admin`)**:
  - State & District macro telemetry tracking NIPUN Bharat / FLN targets across 33 districts.
  - School Management: Register and inspect primary and high schools by mandal.
  - Teacher Management: Teacher roster, assigned classes, and verified sign-off audit logs.
  - Central Student Registry: Search and filter students across districts.
  - AI Voice Calibration: Adjust ASR confidence threshold, WCPM targets, and cloud Falcon streaming keys.
  - Compliance Exports: Download official state literacy PDFs and audits.

- **👩‍🏫 Teacher Panel (`/teacher`)**:
  - Classroom Hub (Class 3-A, Class 4-B).
  - Student roster with 4-tier FLN classification (Story Fluent, Sentence, Word, Alphabet).
  - Conduct live reading tests and verify AI scoring before signing off.
  - Assign tailored Akshara Sadhana practice drills.

- **🎒 Student Panel (`/reading-studio`, `/tutor`, `/practice`, `/student-profile`)**:
  - **Reading Studio (`/reading-studio`)**: Grade 1–5 SCERT Telugu stories, live microphone recording with audio visualizer, real-time Telugu transcription.
  - **AI Reading Tutor (`/tutor`)**: Dedicated conversational voice assistant providing gentle spoken feedback and syllable breakdown.
  - **Word Practice (`/practice`)**: Gamified flashcard drills with celebratory confetti and star rewards.
  - **My Progress (`/student-profile`)**: 12-week WCPM trajectory and printable reading certificates.

- **👨‍👩‍👧 Parent Panel (`/parent`)**:
  - View child's reading trajectory (WCPM speed & accuracy growth).
  - **Voice Recordings**: Listen to the child's recorded voice tests.
  - **Home Literacy Tips**: 4 practical parent practices in simple Telugu (e.g., bedtime reading, finger pointing, sound contrast games).
  - **Official Progress Card**: Print official FLN progress report card.

---

## 🔐 2. Separate Authentication & Strict RBAC

- **Normal Email & Password Login**:
  - No OTP in the password field. OTP is strictly restricted to its intended purpose (password reset & email verification).
  - Password field includes a toggleable **Show/Hide password** option (`Eye` / `EyeOff`).
  - Remember me checkbox and demo credential quick-fill.
  - **Strict Route Guards (RBAC)**: If a Student attempts to navigate to `/admin` or `/teacher`, the application automatically denies access and redirects them.

### Default Authorized Accounts:

| Role | Email Address | Password | Landing Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@telangana.gov.in` | `Admin@1234` | `/admin` |
| **Teacher** | `lakshmi.teacher@telangana.gov.in` | `Teacher@1234` | `/teacher` |
| **Student** | `ramu.student@school.gov.in` | `Student@1234` | `/reading-studio` & `/tutor` |
| **Parent** | `parent.ramu@gmail.com` | `Parent@1234` | `/parent` |

---

## 🎙️ 3. Advanced Telugu AI Voice Engine

Provides natural, authentic Telugu voices with correct phonetic stress and intonation:

1. **Female Telugu Voice**: **Smt. Lakshmi Teacher** (`te-IN-ShrutiNeural`) — Warm, pedagogical maternal cadence tailored for primary school learners.
2. **Male Telugu Voice**: **Sri Mohan Sir / Srinivas** (`te-IN-MohanNeural`) — Deep, authoritative, calm educator voice.
3. **Child Peer Voice**: **Ananya** (`te-IN-ShrutiNeural` with `+26Hz` pitch and `+12%` rate) — Energetic classmate voice.
4. **Falcon AI**: **Anisha** — Modern Indian conversational profile with direct Murf Falcon 2.1 streaming API integration.

### Phonetic Precision & Contrast Analysis:
The AI engine explicitly detects and provides audio guidance for crucial Telugu minimal contrasts:
- **త** (Dental) vs **ట** (Retroflex): ‘తాత’ (పంటికి తాకాలి) vs ‘టమాటా’ (అంగిలికి తాకాలి).
- **ద** (Dental) vs **డ** (Retroflex): ‘దండ’ vs ‘డబ్బా’.
- **న** (Dental Nasal) vs **ణ** (Retroflex Nasal): ‘కన్ను’ vs ‘బాణం’.
- **ల** (Lateral) vs **ళ** (Retroflex Lateral): ‘గాలి’ vs ‘తాళం’.
- **శ** vs **ష** vs **స** (Sibilants): ‘శివుడు’, ‘భాష’, ‘సంతోషం’.
- **ర** vs **ఱ** (Alveolar Trill vs Retroflex Flap): ‘రాయి’ vs ‘గుఱ్ఱం’.
- **హ్రస్వాలు vs దీర్ఘాలు**: Short vs elongated vowel distinction.
- **ఒత్తులు (Ottulu)**: Subscript consonant stress and elongation.

---

## 🤖 4. Interactive Telugu AI Reading Tutor (`/tutor`)

Example live interaction:
- **Child reads correctly:**
  - AI responds: *&ldquo;చాలా బాగా చదివావు! అద్భుతం. ఇప్పుడు నాతో కలిసి మళ్ళీ చదువు: అమ్మ.&rdquo;*
- **Child makes a phonetic contrast mistake (e.g. substituting త for ట):**
  - AI responds: *&ldquo;పర్లేదు బంగారం! ఇంకోసారి ప్రయత్నిద్దాం. ‘త’ దంత్య ధ్వని... ఇప్పుడు అక్షరాలను నెమ్మదిగా నాతో పాటు పలుకు: తా, త.&rdquo;*
- Syllable-by-syllable slow repetition option.
- Positive reinforcement with stars, badges, and confetti.

---

## 🐳 5. Docker Deployment

### Run with Docker Compose:
```bash
docker-compose up --build
```
This automatically builds and launches:
- **Backend Service (Python 3.12 REST API)** on port `8000` with healthchecks.
- **Frontend Service (Next.js 14)** on port `3000`.

### Local Execution (Without Docker):
Run `start-servers.bat` or run:
```bash
# Terminal 1: Frontend
cd frontend
pnpm install
pnpm run dev

# Terminal 2: Backend
cd backend
python server.py
```

Open `http://localhost:3000/login` to access the platform.
