# Software Requirements Specification (SRS)
## Every Child Reads (ప్రతి బిడ్డ చదవాలి) – Telugu AI Assessment Platform
**Document Standard:** IEEE Std 830-1998 Format | **Version:** 3.2-Enterprise  
**Scope:** Foundational Telugu Literacy Assessment SaaS (FLN / NIPUN Bharat Standards)  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the production release of **Every Child Reads (ప్రతి బిడ్డ చదవాలి)**, an AI-powered SaaS system designed for primary schools in Telangana and Andhra Pradesh to conduct Telugu oral reading assessments, compute Words Correct Per Minute (WCPM), diagnose phonemic pronunciation errors, and provide conversational AI reading tutor guidance.

### 1.2 Document Conventions
- **MUST / SHALL:** Mandatory functional or security requirement.
- **SHOULD:** Recommended performance or UI capability.
- **MAY:** Optional or future integration parameter.

---

## 2. Overall Description

### 2.1 Product Perspective
The system operates as a containerized web application comprising a Next.js 14 frontend and a Python 3.12 REST API server. The platform integrates with browser Web Audio APIs for acoustic capture and neural speech synthesis services for authentic Telugu voice generation.

### 2.2 User Classes & Characteristics
- **Admin / State Director:** Technical administrators and policy directors requiring macro telemetry, AI calibration, and user account provisioning.
- **District Educational Officer (DEO):** Regional educational authorities monitoring mandal-level literacy benchmarks and school progress.
- **Teacher (SGT):** Primary educators conducting reading tests in rural/urban schools; requires simple, fast, single-click workflows.
- **Student (Grades 1–5):** Young learners aged 5–11; requires gamified interfaces, large Telugu typography, and audio-first instructions.
- **Parent / Guardian:** Family members monitoring reading progress at home; requires simple Telugu advice and voice recording playback.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
- **User Interfaces:** Dual-language interface (Telugu & English) switchable in real time. Noto Sans Telugu typography for all Telugu passages and phonetic labels.
- **Hardware Interfaces:** Standard desktop, laptop, tablet, or smartphone microphone (44.1kHz or 48kHz audio sampling).
- **Software Interfaces:** Web Audio API, MediaRecorder, Microsoft Edge Cognitive Speech API, Murf AI Falcon 2.1 Streaming API.

### 3.2 Functional Requirements

#### FR-01: Authentication & Role-Based Access Control (RBAC)
- **FR-01.1:** The system SHALL authenticate users via unique email addresses and passwords.
- **FR-01.2:** The system SHALL NOT use OTP in place of the standard password field.
- **FR-01.3:** The system SHALL use OTP exclusively for password reset and identity verification workflows.
- **FR-01.4:** The system SHALL strictly block unauthorized route access (e.g. Students accessing `/admin` or Teachers accessing `/admin`).
- **FR-01.5:** The system SHALL NOT provide client-side role switching dropdowns in production.

#### FR-02: Oral Reading Assessment & Audio Capture
- **FR-02.1:** The system SHALL record oral Telugu reading via browser microphone with zero latency audio buffer streaming.
- **FR-02.2:** The system SHALL render a live audio waveform visualizer while recording.
- **FR-02.3:** The system SHALL display SCERT Telugu stories spanning Grades 1 through 5.

#### FR-03: AI Speech Recognition & Phonemic Alignment
- **FR-03.1:** The system SHALL convert spoken audio to Telugu text using regional acoustic models.
- **FR-03.2:** The system SHALL execute Levenshtein Dynamic Programming alignment between reference words and spoken words.
- **FR-03.3:** The system SHALL calculate WCPM using the formula:  
  $$\text{WCPM} = \left(\frac{\text{Words Correct}}{\text{Duration in Seconds}}\right) \times 60$$
- **FR-03.4:** The system SHALL assign 4-tier FLN classification:
  - $\ge 55\text{ WCPM}$: కథా స్థాయి (Story/Fluent)
  - $40\text{--}54\text{ WCPM}$: వాక్య స్థాయి (Sentence Level)
  - $20\text{--}39\text{ WCPM}$: పద స్థాయి (Word Level)
  - $< 20\text{ WCPM}$: అక్షర స్థాయి (Alphabet/Beginner)

#### FR-04: Telugu AI Reading Tutor
- **FR-04.1:** The tutor SHALL support both Male (Sri Mohan Sir) and Female (Smt. Lakshmi Teacher) authentic voices.
- **FR-04.2:** The tutor SHALL detect minimal contrast errors:
  - Dental vs Retroflex: `త` vs `ట`, `ద` vs `డ`
  - Nasals: `న` vs `ణ`
  - Laterals: `ల` vs `ళ`
  - Sibilants: `శ` vs `ష` vs `స`
  - Trills: `ర` vs `ఱ`
  - Vowel Length: Short vs Elongated
- **FR-04.3:** The tutor SHALL deliver gentle corrective spoken guidance in Telugu and provide syllable-by-syllable slow repetition.

#### FR-05: Teacher Review & Sign-Off
- **FR-05.1:** The system SHALL allow the assigned teacher to review AI-flagged words, adjust status, add notes, and digitally sign off.
- **FR-05.2:** The system SHALL generate printable SCERT-compliant progress report cards.

---

## 4. Performance & Reliability Requirements
- **PR-01:** System response time for speech alignment SHALL not exceed 600 milliseconds.
- **PR-02:** Rate limiter SHALL enforce a maximum of 10 login requests per minute per IP to prevent brute-force attacks.
- **PR-03:** System uptime SHALL target 99.9% availability during school hours (08:00 to 18:00 IST).

