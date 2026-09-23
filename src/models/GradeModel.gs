/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * GradeModel.gs - Score Conversion Engine, Standardized Assessment Rubrics & Certificate Payload
 */

var GradeModel = (function () {
  /**
   * Calculate TOEFL ITP Scaled Score from raw section correct counts
   */
  function calculateToeflScore(rawListening, rawStructure, rawReading) {
    var lTable = CONFIG.TOEFL_CONVERSION_TABLE.listening;
    var sTable = CONFIG.TOEFL_CONVERSION_TABLE.structure;
    var rTable = CONFIG.TOEFL_CONVERSION_TABLE.reading;

    var lIndex = Math.min(Math.max(0, Math.round(rawListening)), lTable.length - 1);
    var sIndex = Math.min(Math.max(0, Math.round(rawStructure)), sTable.length - 1);
    var rIndex = Math.min(Math.max(0, Math.round(rawReading)), rTable.length - 1);

    var scaledL = lTable[lIndex] || 31;
    var scaledS = sTable[sIndex] || 31;
    var scaledR = rTable[rIndex] || 31;

    var totalScore = Math.round(((scaledL + scaledS + scaledR) * 10) / 3);
    var cefr = getCefrLevel("TOEFL", totalScore);

    return {
      type: "TOEFL_ITP",
      rawScores: { listening: rawListening, structure: rawStructure, reading: rawReading },
      scaledScores: { listening: scaledL, structure: scaledS, reading: scaledR },
      totalScore: totalScore,
      maxScore: 677,
      minScore: 310,
      cefr: cefr,
      gradeStatus: totalScore >= 500 ? "PASSED (Memenuhi Syarat)" : "NEEDS IMPROVEMENT (Perlu Pengayaan)"
    };
  }

  /**
   * Calculate IELTS Overall Band from raw section counts or rubric scores
   */
  function calculateIeltsBand(rawListening, rawReading, writingBand, speakingBand) {
    var lBand = 1.0;
    var rBand = 1.0;

    var lTable = CONFIG.IELTS_CONVERSION_TABLE.listening;
    for (var i = 0; i < lTable.length; i++) {
      if (rawListening >= lTable[i].min && rawListening <= lTable[i].max) {
        lBand = lTable[i].band;
        break;
      }
    }

    var rTable = CONFIG.IELTS_CONVERSION_TABLE.reading_academic;
    for (var j = 0; j < rTable.length; j++) {
      if (rawReading >= rTable[j].min && rawReading <= rTable[j].max) {
        rBand = rTable[j].band;
        break;
      }
    }

    var wBand = parseFloat(writingBand) || 6.0;
    var sBand = parseFloat(speakingBand) || 6.0;

    var avg = (lBand + rBand + wBand + sBand) / 4;
    // IELTS rounding rule: .25 rounds up to .5, .75 rounds up to next whole band
    var decimal = avg - Math.floor(avg);
    var overall = Math.floor(avg);
    if (decimal < 0.25) {
      overall += 0;
    } else if (decimal < 0.75) {
      overall += 0.5;
    } else {
      overall += 1.0;
    }

    var cefr = getCefrLevel("IELTS", overall);

    return {
      type: "IELTS_ACADEMIC",
      sectionBands: {
        listening: lBand,
        reading: rBand,
        writing: wBand,
        speaking: sBand
      },
      overallBand: overall.toFixed(1),
      maxBand: "9.0",
      cefr: cefr,
      gradeStatus: overall >= 6.5 ? "PASSED (Memenuhi Syarat)" : "NEEDS IMPROVEMENT (Perlu Pengayaan)"
    };
  }

  /**
   * Determine CEFR Level from exam score
   */
  function getCefrLevel(examType, score) {
    var mappings = CONFIG.CEFR_MAPPING;
    if (examType === "TOEFL" || examType === "TOEFL_ITP" || examType === "EPT") {
      for (var i = 0; i < mappings.length; i++) {
        if (score >= mappings[i].toeflMin) return mappings[i];
      }
    } else if (examType === "IELTS" || examType === "IELTS_ACADEMIC") {
      for (var j = 0; j < mappings.length; j++) {
        if (score >= mappings[j].ieltsMin) return mappings[j];
      }
    }
    return mappings[mappings.length - 1];
  }

  /**
   * Generate comprehensive Assessment Report & Certificate Data
   */
  function generateCertificateData(submission, user, exam) {
    var certNumber = "CERT/AL-IMAM/" + new Date().getFullYear() + "/" + (submission.id || "001");
    var issueDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    var qrPayload = JSON.stringify({
      certNo: certNumber,
      candidate: user.fullName || submission.studentName,
      institution: CONFIG.INSTITUTION_NAME,
      exam: exam.title || submission.examTitle,
      score: submission.scaledScore || submission.calculatedScore || "N/A",
      cefr: submission.gradeStatus || "Certified",
      issued: issueDate,
      verificationUrl: CONFIG.INSTITUTION_WEBSITE + "/verify?cert=" + certNumber
    });

    var qualitativeAnalysis = generateQualitativeFeedback(submission, exam.type);

    return {
      certificateNumber: certNumber,
      issueDate: issueDate,
      candidateName: user.fullName || submission.studentName,
      candidateId: user.id || submission.studentId,
      classGroup: user.classGroup || "Senior Academic Batch",
      foundationName: CONFIG.FOUNDATION_NAME || "Yayasan SAPIN Darussalam",
      institutionName: CONFIG.INSTITUTION_NAME,
      institutionAddress: CONFIG.INSTITUTION_ADDRESS || "Limus Pratama Regency Jl. Blitar Blok E.12/7B RT 004/ RW 011, Ds./ Kel Limus Nunggal, Kec. Cileungsi, Kab. Bogor, Prop. Jawa Barat. 16820",
      institutionMotto: CONFIG.INSTITUTION_MOTTO,
      logoUrl: CONFIG.LOGO_URL,
      examTitle: exam.title || "Standardized English Proficiency Assessment",
      examType: exam.type,
      scoreSummary: submission.scoreSummary || {},
      cefrBadge: submission.cefr || { level: "B2", name: "Vantage / Upper Intermediate", color: "#2563eb" },
      qualitativeAnalysis: qualitativeAnalysis,
      qrVerificationPayload: qrPayload,
      leadExaminer: "Kepala Sekolah",
      leadExaminerSub: "SMP Al-Imam Islamic School (AI IS)",
      headOfSchool: "Ketua Yayasan",
      headOfSchoolSub: "Yayasan SAPIN Darussalam"
    };
  }

  /**
   * Generate descriptive qualitative feedback (Standard Assessment Report style)
   */
  function generateQualitativeFeedback(submission, examType) {
    return {
      strengths: [
        "Strong comprehension of academic texts and complex vocabulary context.",
        "Accurate application of standard English grammatical structures and inverted clauses.",
        "Demonstrated disciplined focus and academic integrity throughout proctored session."
      ],
      areasForDevelopment: [
        "Enhance listening response speed on fast-paced idiomatic colloquial expressions.",
        "Broaden academic transitions and cohesive conjunctions in long-form argumentative essays."
      ],
      islamicCharacterNote: "Peserta menunjukkan kejujuran, ketekunan, dan adab thalabul 'ilmi yang sangat baik selama pelaksanaan asesmen digital."
    };
  }

  return {
    calculateToeflScore: calculateToeflScore,
    calculateIeltsBand: calculateIeltsBand,
    getCefrLevel: getCefrLevel,
    generateCertificateData: generateCertificateData,
    generateQualitativeFeedback: generateQualitativeFeedback
  };
})();
