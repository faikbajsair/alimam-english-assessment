/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * ReportController.gs - PDF Certificate, Assessment Report Data & Performance Analytics
 */

var ReportController = (function () {
  /**
   * Get student transcript & certificate details
   */
  function getStudentReport(submissionId, candidateId) {
    // Generate high-resolution report structure
    var report = {
      submissionId: submissionId || "SUB-2026-001",
      candidate: {
        id: candidateId || "USR-STUD01",
        fullName: "Muhammad Rayhan Al-Fatih",
        classGroup: "Grade 12 - Science Alpha",
        nisn: "0068192345",
        institution: CONFIG.INSTITUTION_NAME
      },
      assessment: {
        title: "Al-Imam Standardized TOEFL ITP Full Diagnostic",
        type: "TOEFL_ITP",
        testDate: "September 23, 2026",
        scoreScaled: 577,
        cefrLevel: "B2",
        cefrDescriptor: "Vantage / Upper Intermediate",
        sections: [
          { name: "Section 1: Listening Comprehension", raw: "41/50", scaled: 58, max: 68, percentage: 85 },
          { name: "Section 2: Structure & Written Expression", raw: "34/40", scaled: 57, max: 68, percentage: 84 },
          { name: "Section 3: Reading Comprehension", raw: "42/50", scaled: 58, max: 67, percentage: 86 }
        ]
      },
      assessmentEvaluation: {
        strengths: "Excellent mastery of complex grammatical clauses, high listening accuracy for academic dialogue.",
        recommendations: "Practice rapid reading for main ideas and idiomatic phrasal verbs.",
        islamicCharacterAdab: "Exemplary Character, Honest, and Steadfastly Upholds Digital Assessment Integrity (Character Rating: A)."
      },
      qrCodeData: JSON.stringify({
        verificationUrl: CONFIG.INSTITUTION_WEBSITE + "/verify?id=" + (submissionId || "SUB-2026-001"),
        candidate: "Muhammad Rayhan Al-Fatih",
        score: 577,
        cefr: "B2"
      })
    };

    return {
      success: true,
      report: report
    };
  }

  /**
   * Get institutional analytics KPI overview
   */
  function getExecutiveAnalytics() {
    return {
      totalCandidates: 142,
      activeExams: 3,
      avgToeflScore: 548,
      avgIeltsBand: "6.5",
      passRatePercentage: 92.4,
      cefrDistribution: [
        { level: "C1 / C2 (Advanced)", count: 28, percentage: 19.7 },
        { level: "B2 (Upper Intermediate)", count: 64, percentage: 45.1 },
        { level: "B1 (Intermediate)", count: 38, percentage: 26.8 },
        { level: "A1 / A2 (Elementary)", count: 12, percentage: 8.4 }
      ],
      recentSubmissions: [
        { id: "SUB-01", candidate: "Muhammad Rayhan Al-Fatih", exam: "TOEFL ITP Diagnostic", score: "577 / 677", cefr: "B2", status: "PASSED", date: "Today" },
        { id: "SUB-02", candidate: "Aisha Zahra Nurhaliza", exam: "IELTS Academic Simulation", score: "7.5 / 9.0", cefr: "C1", status: "PASSED", date: "Today" },
        { id: "SUB-03", candidate: "Fathir Ahmad Pratama", exam: "Al-Imam EPT", score: "520 / 677", cefr: "B2", status: "PASSED", date: "Yesterday" },
        { id: "SUB-04", candidate: "Khadijah Maryam", exam: "TOEFL ITP Diagnostic", score: "610 / 677", cefr: "C1", status: "PASSED", date: "Yesterday" }
      ]
    };
  }

  return {
    getStudentReport: getStudentReport,
    getExecutiveAnalytics: getExecutiveAnalytics
  };
})();
