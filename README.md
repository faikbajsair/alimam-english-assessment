# SMP AL-IMAM ISLAMIC SCHOOL (AI IS) - ENGLISH ASSESSMENT SYSTEM

> **Enterprise Standardized English Assessment & Proctoring Platform**  
> *Committed to Faith, Character, and Excellence*  
> **SMP Al-Imam Islamic School (AI IS) | Development by Al-Imam EduTech**

---

## 1. SYSTEM OVERVIEW

The **SMP Al-Imam English Assessment System** is an enterprise-scale English examination platform designed specifically for SMP Al-Imam Islamic School (AI IS) to meet international testing standards (**TOEFL ITP/PBT, IELTS Academic & General, TOEIC, and Al-Imam EPT**).

The system is built using a lightweight, high-performance **MVC (Model-View-Controller)** architectural pattern. It features strict proctoring (anti-cheating), standardized rubric grading, and is **commercial SaaS / White-Label ready** with a comprehensive CMS Appearance Configurator.

---

## 2. KEY FEATURES & SPECIFICATIONS

### A. Interactive Test Builder
- **Multi-Format Question Types**:
  - **Listening Section**: Multiple choice with custom audio player, play count limits, and visual progress tracking.
  - **Structure & Written Expression**: Multiple choice and error identification.
  - **Reading Comprehension**: Split-screen passage viewer with interactive text highlighter.
  - **Writing Section (Task 2 Essay)**: Rich essay editor with live word count and rubric grading guidance.
  - **Speaking Section (Part 2 Audio)**: Direct in-browser voice recording via Web Audio / `MediaRecorder` API.
  - **Drag and Drop / Matching Pairs**: Collocation matching and grammatical pairs.
- **Bulk Import & Export**: Full support for importing and exporting question templates via CSV, Excel, and Google Sheets.
- **Onboarding Tutorial Wizard**: Interactive step-by-step guide for teachers and examiners.

### B. Strict Proctoring Engine (Anti-Cheating)
- **Full-Screen Enforcement**: Locks candidate viewport during the active test session.
- **Tab Switching & Blur Detector**: Temporarily locks the answer sheet and issues warnings up to **3 Strikes** before automatic submission.
- **Copy-Paste & Right-Click Prevention**: Disables right-click context menu, free text selection, and shortcut keys (`Ctrl+C`, `Ctrl+V`, `F12`, `Alt+Tab`).
- **AI Camera Proctoring**: Periodic webcam snapshot stream to verify student test integrity.
- **Randomization Engine**: Automated question order and option shuffling.

### C. Standardized Grading & International Score Conversion
- **Automated Score Conversion**:
  - Automatic raw score conversion to the **TOEFL scale (310–677)**.
  - Score conversion to **IELTS Band (0–9.0)** with official rounding.
  - Standardized proficiency mapping to the **CEFR framework (A1, A2, B1, B2, C1, C2)**.
- **Standardized Rubric Grading**: Dedicated grading queue for examiners to evaluate essay and speaking recordings across 4 analytical criteria with student character & conduct notes.
- **Certificate & Assessment Report Generator**: Official digital certificate issuance with QR code authenticity verification and digital examiner signature.

### D. CMS Appearance & SaaS Licensing Configurator
- **Theme & Branding Customizer**: Instant configuration of primary/secondary/accent colors, institution logo, motto/tagline, and footer.
- **Commercial License Management**:
  - Tiered licensing: *Starter* (100 Students), *Professional* (500 Students), *Enterprise* (5,000 Students / Unlimited).
  - Serial key license generator & validator.
- **1-Click Backup & Restore**: Download entire database in encrypted JSON format and restore at any time.

---

## 3. ARCHITECTURE & CODE STRUCTURE (MVC PATTERN)

```text
├── src/
│   ├── models/
│   │   ├── UserModel.gs          # Authentication, Roles, Student Data & Quotas
│   │   ├── QuestionModel.gs      # Question Bank (TOEFL/IELTS/EPT) & Audio URLs
│   │   ├── ExaminationModel.gs   # Exam Sessions, Timers, Heartbeats & Violation Tracking
│   │   └── GradeModel.gs         # TOEFL/IELTS Score Conversion & Evaluation Logic
│   ├── controllers/
│   │   ├── AuthController.gs     # Login Handlers, Session Tokens & Role Authorization
│   │   ├── ExamController.gs     # Anti-Cheating Logic, Submissions, Audio & Auto-Save
│   │   ├── CmsController.gs      # Appearance Customizer, White-Label & Licensing
│   │   └── ReportController.gs   # PDF Certificate Generator, QR Codes & Analytics
│   ├── views/
│   │   ├── index.html            # Unified Landing Page & Login Portal
│   │   ├── student-exam.html     # Interactive Exam Player & Proctoring Suite
│   │   ├── admin-dashboard.html  # Admin Management Dashboard, Test Builder & Examiner Queue
│   │   ├── cms-appearance.html   # White-Label Appearance Customizer & SaaS Licensing
│   │   └── onboarding-guide.html # Interactive User Guide & Onboarding Wizard
│   ├── Config.gs                 # Global Configuration, Logo URLs, DB IDs, Scoring Tables
│   └── Code.gs                   # Main Entrypoint Google Apps Script Router
├── index.html                    # Master Single Page Application (Vercel & Standalone Mode)
├── vercel.json                   # Serverless Routing Configuration for Vercel
├── appsscript.json               # Google Apps Script V8 Runtime Manifest
└── README.md                     # Documentation, Installation Guide & Commercial Information
```

---

## 4. DEPLOYMENT & INSTALLATION GUIDE

### A. Deploy to Google Apps Script (GAS)
1. Create a new Google Spreadsheet in Google Drive (e.g., `DB_AlImam_English_Assessment`).
2. Open **Extensions > Apps Script**.
3. Copy all files from the `src/` directory into the Apps Script editor:
   - Create `.gs` files for each file under `src/models/`, `src/controllers/`, `src/Config.gs`, and `src/Code.gs`.
   - Create HTML files for each file under `src/views/`.
4. Replace the contents of `appsscript.json` with the project's `appsscript.json`.
5. Run the `initialSetupDatabase()` function in `src/Code.gs` to automatically initialize required database sheets (*Users, Exams, Questions, Submissions, Settings*).
6. Click **Deploy > New Deployment**:
   - Deployment Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Save the generated Web App URL.

### B. Deploy to Vercel (Frontend Hosting)
1. Push this repository to your **GitHub** account.
2. Go to the [Vercel Dashboard](https://vercel.com) and select **Add New Project**.
3. Import this GitHub repository.
4. Set Framework Preset to **Other** (Root Directory: `./`).
5. Click **Deploy**.
6. The web app is now live globally with instantaneous serverless edge performance!

---

## 5. DEMO ACCOUNT CREDENTIALS

| Role | Username | Password | Permissions & Access Description |
|---|---|---|---|
| **Super Admin** | `superadmin` | `admin123` | Full system access, license management & database backup |
| **Admin CMS** | `admincms` | `admin123` | White-label appearance customization & exam scheduling |
| **Teacher / Examiner** | `teacher` | `teacher123` | Question bank authoring & essay/speaking rubric grading |
| **Student / Candidate** | `candidate1` | `student123` | Student test taker, interactive exam player & certificate download |

---

## 6. LICENSE & COPYRIGHT

Developed by **Al-Imam EduTech** for **SMP Al-Imam Islamic School (AI IS)**.  
All Rights Reserved © 2026.
