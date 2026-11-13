# Product Requirements Document (PRD)
## Every Child Reads (ప్రతి బిడ్డ చదవాలి) – Foundational Telugu AI Literacy Platform
**TISC Problem Statement 06** | Government School Telugu Literacy & AI Reading Assessment SaaS  
**Version:** 3.2-Enterprise | **Target Audience:** School Education Departments of Telangana & Andhra Pradesh  
**Compliance Standards:** NIPUN Bharat, FLN (Foundational Literacy and Numeracy), DPDP Act 2023  

---

## 1. Executive Summary & Product Vision
Every Child Reads is an enterprise-grade AI SaaS platform engineered for government primary schools (Grades 1–5). The platform automates Telugu oral reading fluency assessment, identifies phonetic and syllable-level weaknesses in conjuncts (సంయుక్తాక్షరాలు) and vowel elongations (దీర్ఘాలు), measures Words Correct Per Minute (WCPM) against national FLN benchmarks, and generates precision remediation through an interactive conversational Telugu AI Reading Tutor.

---

## 2. Target Users & Problem Statements

### 2.1 Primary User Personas & Pain Points
1. **Primary School Students (Grades 1–5):**
   - *Pain Point:* Hesitation and confusion over complex Telugu grapheme clusters, minimal phonetic contrasts (e.g., retroflex vs. dental: త vs. ట, ల vs. ళ), and lack of personalized, encouraging reading practice at home.
   - *Need:* Non-judgmental, child-friendly AI tutor providing instant spoken Telugu feedback with syllable breakdowns and star rewards.
2. **Telugu Primary Educators (SGTs):**
   - *Pain Point:* Conducting manual, 1-on-1 reading tests with stopwatches for 30–45 children per classroom consumes weeks of instructional time.
   - *Need:* Rapid, automated classroom assessments with instant word-by-word error mapping and teacher verification sign-off workflows.
3. **Parents & Guardians:**
   - *Pain Point:* Inability to gauge child's reading level or guide pronunciation at home.
   - *Need:* Accessible parent portal showing reading trajectory, audio recording playback of child's tests, and practical home support tips.
4. **State Education Directors & District Educational Officers (DEOs):**
   - *Pain Point:* Stale paper-based FLN surveys without granular telemetry or mandal-level bottleneck visibility.
   - *Need:* Real-time macro dashboards tracking WCPM velocity, school rankings, and compliance export reports.

---

## 3. Product Scope & Functional Modules

### 3.1 Portal Architecture (Strict RBAC Isolation)
The platform enforces role isolation without cross-portal leakage:
- **Admin Portal (`/admin`):** Statewide/district analytics, school management, teacher account approval, central student registry, and AI calibration.
- **DEO Portal:** Assigned district telemetry, mandal school comparisons, and FLN benchmark compliance audits.
- **Teacher Portal (`/teacher`):** Classroom student roster, reading test assignments, verification sign-offs, and print-ready report cards.
- **Student Portal (`/reading-studio`, `/tutor`, `/practice`):** Child-friendly reading studio, interactive conversational AI reading tutor, gamified Akshara Sadhana flashcards, and star badges.
- **Parent Portal (`/parent`):** Child's WCPM progress trajectory, voice test recordings playback, home reading guidance, and printable progress cards.

### 3.2 Core Feature Matrix
| Module | Capability | Implementation Specification |
| :--- | :--- | :--- |
| **Authentication** | Individual Credentials | Email + Password with Show/Hide toggle; OTP strictly reserved for password reset. |
| **Speech Recognition (ASR)** | Real-Time Telugu Capture | Web Audio API capturing live microphone audio; Levenshtein DP phonetic alignment. |
| **AI Reading Tutor** | Conversational Voice Assistant | Two genuine Telugu voices (Male Sri Mohan / Female Smt. Lakshmi); gentle mistake correction. |
| **Phonetic Analysis** | Contrast Error Diagnostics | Detects dental vs retroflex (త/ట, ద/డ, ల/ళ, న/ణ), sibilants (శ/ష/స), and vowel length errors. |
| **Scoring Engine** | FLN Benchmarking | Computes accuracy percentage, WCPM, fluency score, and assigns 4-tier FLN classification. |
| **Data Privacy** | Child Protection | 90-day audio retention policy, automated purging, institutional consent records. |

---

## 4. Non-Functional Requirements (NFRs)
- **Security:** Strict RBAC, parameterized endpoints, rate limiting (10 login req/min/IP), security headers (CSP, X-Frame-Options, X-Content-Type-Options).
- **Latency:** Real-time audio alignment under 500ms; TTS audio generation under 800ms.
- **Accessibility:** Large Noto Sans Telugu typography, high contrast colors, bilingual localization toggle (తెలుగు / English).
- **Deployment:** Dockerized microservices (`docker-compose up --build`) on port 3000 (Frontend) and port 8000 (Backend).

