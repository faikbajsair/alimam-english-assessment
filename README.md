# AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM

> **Enterprise Standardized English Assessment & Proctoring Platform**  
> *Mencetak Generasi Unggul Berakhlak Mulia & Berwawasan Global*  
> **Lembaga Pendidikan Al-Imam | Version 2.5.0 Enterprise**

---

## 1. TENTANG SISTEM (SYSTEM OVERVIEW)

**Al-Imam Professional English Assessment System** adalah platform ujian Bahasa Inggris berskala enterprise yang dirancang khusus untuk memenuhi standar ujian internasional (**TOEFL ITP/PBT, IELTS Academic & General, TOEIC, dan Al-Imam EPT**).

Sistem dibangun menggunakan pola arsitektur **MVC (Model-View-Controller)** yang sangat ringan, efisien, memiliki proctoring ketat (anti-curang), mengadopsi fleksibilitas pembobotan **App Rapor MBU**, serta **siap dikomersialkan / dijual sebagai produk SaaS atau On-Premise White-Label** dengan CMS Appearance Configurator lengkap.

---

## 2. FITUR UTAMA & SPESIFIKASI

### A. Fitur Pembuatan Soal (Interactive Test Builder)
- **Multi-Format Question Types**:
  - **Listening Section**: Multiple choice dengan custom audio player, batas putar audio, dan visual progress.
  - **Structure & Written Expression**: Pilihan ganda & analisis kesalahan (*error identification*).
  - **Reading Comprehension**: Split-screen passage viewer dengan penyorot teks (*highlighter*).
  - **Writing Section (Task 2 Essay)**: Editor esai dengan penghitung kata (*live word counter*) dan panduan rubrik.
  - **Speaking Section (Part 2 Audio)**: Perekaman suara langsung dari browser peserta via Web Audio / `MediaRecorder` API.
  - **Drag and Drop / Matching Pairs**: Pencocokan kolokasi dan pasangan gramatikal.
- **Bulk Import & Export**: Dukungan ekspor dan impor template soal berbasis CSV, Excel, dan Google Sheets.
- **Onboarding Tutorial Wizard**: Panduan interaktif langkah-demi-langkah bagi guru dan pembuat soal pemula.

### B. Fitur Anti-Curang (Strict Proctoring Engine)
- **Full-Screen Enforcement**: Mengunci tampilan peserta selama ujian berlangsung.
- **Tab Switching & Blur Detector**: Mengunci lembar jawaban dan memberikan peringatan **maksimal 3 kali (3 Strikes)** sebelum otomatis dikumpulkan (*auto-submit*).
- **Copy-Paste & Right-Click Ban**: Mematikan klik kanan, seleksi teks bebas, serta shortcut tombol (`Ctrl+C`, `Ctrl+V`, `F12`, `Alt+Tab`).
- **AI Camera Proctoring**: Snapshot berkala webcam peserta untuk memastikan integritas ujian.
- **Randomization Engine**: Pengacakan urutan nomor soal dan opsi jawaban secara otomatis.

### C. Penilaian & Integrasi Rapor MBU
- **Konversi Skor Otomatis**:
  - Konversi otomatis nilai mentah (*raw score*) ke skala **TOEFL (310–677)**.
  - Konversi skor ke **IELTS Band (0–9.0)** dengan pembulatan resmi.
  - Pemetaan standar kecakapan **CEFR (A1, A2, B1, B2, C1, C2)**.
- **Rubrik Penilaian MBU**: Antrean penilaian esai dan audio respon untuk dewan penguji (*Examiner*) dengan 4 kriteria analitik dan catatan adab/akhlak santri.
- **Generator Sertifikat & Rapor PDF**: Penerbitan sertifikat digital resmi lengkap dengan QR code verifikasi keaslian dan tanda tangan digital dewan penguji.

### D. CMS Appearance & SaaS Licensing Configurator
- **Theme & Branding Customizer**: Pengaturan instan warna utama (*Primary/Secondary/Accent*), logo instansi, motto/tagline, dan footer.
- **Manajemen Lisensi Komersial**:
  - Tingkatan lisensi: *Starter* (100 Siswa), *Professional* (500 Siswa), *Enterprise* (5.000 Siswa / Unlimited).
  - Generator & validator lisensi serial key.
- **1-Click Backup & Restore**: Unduh seluruh isi database dalam format JSON terenkripsi dan pulihkan kapan saja.

---

## 3. STRUKTUR ARSITEKTUR KODE (MVC PATTERN)

```text
├── src/
│   ├── models/
│   │   ├── UserModel.gs          # Kelola Auth, Role, Student Data & Quota
│   │   ├── QuestionModel.gs     # Kelola Bank Soal TOEFL/IELTS/EPT & Audio URL
│   │   ├── ExaminationModel.gs  # Kelola Sesi Ujian, Timer, Heartbeat & Pelanggaran
│   │   └── GradeModel.gs        # Konversi Skor Skala TOEFL/IELTS & Logik Rapor MBU
│   ├── controllers/
│   │   ├── AuthController.gs    # Handler Login, Token Session & Otorisasi Role
│   │   ├── ExamController.gs    # Logic Anti-Curang, Submit, Audio & Auto-Save
│   │   ├── CmsController.gs     # Pengaturan Tampilan, White-Label & Lisensi
│   │   └── ReportController.gs  # Generator Sertifikat PDF, QR Code & Analitik
│   ├── views/
│   │   ├── index.html           # Landing Page & Portal Masuk Terpadu
│   │   ├── student-exam.html    # Player Soal Ujian (Interaktif & Proctoring)
│   │   ├── admin-dashboard.html # Dashboard Pengelola, Test Builder & Examiner
│   │   ├── cms-appearance.html  # Customizer Tampilan Aplikasi & SaaS License
│   │   └── onboarding-guide.html# Panduan Penggunaan Interaktif Pembuat Soal
│   ├── Config.gs                # Konfigurasi Global, Logo URL, DB ID, Scoring Table
│   └── Code.gs                  # Main Entrypoint Google Apps Script Router
├── index.html                   # Master Single Page App (Vercel & Standalone Mode)
├── vercel.json                  # Konfigurasi Routing Serverless Hosting Vercel
├── appsscript.json              # Manifest Runtime V8 Google Apps Script
└── README.md                    # Dokumentasi Instalasi, Panduan & Komersial
```

---

## 4. PANDUAN DEPLOYMENT & INSTALASI

### A. Deploy ke Google Apps Script (GAS)
1. Buat Spreadsheet baru di Google Drive (misal: `DB_AlImam_English_Assessment`).
2. Buka menu **Extensions > Apps Script**.
3. Salin seluruh file dari folder `src/` ke dalam Apps Script editor:
   - Buat file `.gs` untuk setiap file di `src/models/`, `src/controllers/`, `src/Config.gs`, dan `src/Code.gs`.
   - Buat file HTML untuk setiap file di `src/views/`.
4. Ganti isi `appsscript.json` dengan file `appsscript.json` yang ada di repository ini.
5. Jalankan fungsi `initialSetupDatabase()` di `src/Code.gs` untuk menginisialisasi tabel-tabel sheet otomatis (*Users, Exams, Questions, Submissions, Settings*).
6. Klik **Deploy > New Deployment**:
   - Tipe: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Simpan URL Web App yang dihasilkan.

### B. Deploy ke Vercel (Frontend Hosting)
1. Push repository ini ke akun **GitHub**.
2. Buka [Vercel Dashboard](https://vercel.com) dan pilih **Add New Project**.
3. Impor repository GitHub ini.
4. Framework Preset: **Other** (Root Directory: `./`).
5. Klik **Deploy**.
6. Web app akan langsung aktif secara global dengan performa serverless instan!

---

## 5. KREDENSIAL AKUN DEMO

| Peran (Role) | Username | Password | Deskripsi Hak Akses |
|---|---|---|---|
| **Super Admin** | `superadmin` | `admin123` | Akses penuh, manajemen lisensi & backup database |
| **Admin CMS** | `admincms` | `admin123` | Kustomisasi tampilan white-label & jadwal ujian |
| **Teacher / Examiner** | `teacher` | `teacher123` | Pembuat bank soal & penilai esai/audio MBU |
| **Student / Candidate** | `candidate1` | `student123` | Peserta ujian, pengerjaan soal & unduh sertifikat |

---

## 6. LISENSI & HAK CIPTA

Dikembangkan oleh **Tim Pengembang EdTech Al-Imam** untuk **Lembaga Pendidikan Al-Imam**.  
Hak Cipta Dilindungi Undang-Undang © 2026.
