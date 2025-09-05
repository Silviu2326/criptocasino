const crypto = require('crypto');

class KYCAMLService {
  constructor() {
    this.kycSubmissions = new Map();
    this.amlAlerts = new Map();
    this.riskScores = new Map();
    this.blacklist = new Set([
      // Demo blacklisted addresses
      '0x000000000000000000000000000000000000dead',
      '0x1234567890123456789012345678901234567890'
    ]);
  }

  // Risk assessment levels
  getRiskLevel(score) {
    if (score >= 80) return 'HIGH';
    if (score >= 60) return 'MEDIUM';
    if (score >= 30) return 'LOW';
    return 'MINIMAL';
  }

  // Check wallet address against various risk factors
  async assessWalletRisk(walletAddress) {
    let riskScore = 0;
    const riskFactors = [];

    // Check blacklist
    if (this.blacklist.has(walletAddress.toLowerCase())) {
      riskScore += 100;
      riskFactors.push('BLACKLISTED_ADDRESS');
    }

    // Simulate blockchain analysis
    const simulatedRiskFactors = await this.simulateBlockchainAnalysis(walletAddress);
    riskScore += simulatedRiskFactors.score;
    riskFactors.push(...simulatedRiskFactors.factors);

    // Check transaction patterns
    const transactionRisk = await this.analyzeTransactionPatterns(walletAddress);
    riskScore += transactionRisk.score;
    riskFactors.push(...transactionRisk.factors);

    const assessment = {
      walletAddress,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      factors: riskFactors,
      timestamp: new Date().toISOString(),
      requiresManualReview: riskScore >= 70
    };

    this.riskScores.set(walletAddress, assessment);
    return assessment;
  }

  async simulateBlockchainAnalysis(walletAddress) {
    // Simulate API calls to blockchain analytics services
    const factors = [];
    let score = 0;

    // Simulate various risk checks
    const riskChecks = [
      { name: 'MIXER_EXPOSURE', probability: 0.05, score: 40 },
      { name: 'EXCHANGE_RISK', probability: 0.1, score: 20 },
      { name: 'GAMBLING_HISTORY', probability: 0.15, score: 10 },
      { name: 'HIGH_VOLUME_TRADING', probability: 0.2, score: 15 },
      { name: 'NEW_ADDRESS', probability: 0.3, score: 5 },
      { name: 'SUSPICIOUS_PATTERNS', probability: 0.08, score: 35 }
    ];

    // Generate hash-based deterministic results
    const hash = crypto.createHash('sha256').update(walletAddress).digest('hex');
    
    riskChecks.forEach((check, index) => {
      const hashSlice = parseInt(hash.substring(index * 4, (index + 1) * 4), 16);
      const probability = (hashSlice % 100) / 100;
      
      if (probability < check.probability) {
        factors.push(check.name);
        score += check.score;
      }
    });

    return { score, factors };
  }

  async analyzeTransactionPatterns(walletAddress) {
    // Simulate transaction pattern analysis
    const factors = [];
    let score = 0;

    // Mock analysis based on wallet address
    const hash = crypto.createHash('sha256').update(walletAddress + 'patterns').digest('hex');
    const analysisValue = parseInt(hash.substring(0, 8), 16);

    if (analysisValue % 10 === 0) {
      factors.push('RAPID_SUCCESSION_TRANSACTIONS');
      score += 25;
    }

    if (analysisValue % 15 === 0) {
      factors.push('UNUSUAL_AMOUNT_PATTERNS');
      score += 20;
    }

    if (analysisValue % 20 === 0) {
      factors.push('CROSS_CHAIN_ACTIVITY');
      score += 15;
    }

    return { score, factors };
  }

  // KYC Document Verification
  async submitKYCDocument(walletAddress, documentData) {
    const submissionId = crypto.randomUUID();
    
    const submission = {
      id: submissionId,
      walletAddress,
      type: documentData.type, // 'passport', 'drivers_license', 'id_card'
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      documentHash: crypto.createHash('sha256').update(documentData.base64Data || '').digest('hex'),
      metadata: {
        fileName: documentData.fileName,
        fileSize: documentData.fileSize,
        mimeType: documentData.mimeType
      },
      autoVerificationResults: await this.performAutoVerification(documentData),
      manualReviewRequired: false
    };

    // Auto-approve or flag for manual review
    if (submission.autoVerificationResults.overallScore >= 85) {
      submission.status = 'APPROVED';
      submission.approvedAt = new Date().toISOString();
    } else if (submission.autoVerificationResults.overallScore <= 40) {
      submission.status = 'REJECTED';
      submission.rejectedAt = new Date().toISOString();
      submission.rejectionReason = 'Document verification failed';
    } else {
      submission.manualReviewRequired = true;
      submission.status = 'PENDING_MANUAL_REVIEW';
    }

    this.kycSubmissions.set(submissionId, submission);
    return submission;
  }

  async performAutoVerification(documentData) {
    // Simulate AI-powered document verification
    const hash = crypto.createHash('sha256').update(documentData.base64Data || 'demo').digest('hex');
    const verificationScore = (parseInt(hash.substring(0, 8), 16) % 100);

    const results = {
      overallScore: verificationScore,
      checks: {
        documentQuality: Math.min(100, verificationScore + 10),
        faceMatch: Math.min(100, verificationScore + 5),
        documentAuthenticity: Math.min(100, verificationScore - 5),
        dataExtraction: Math.min(100, verificationScore + 15),
        liveness: Math.min(100, verificationScore + 8)
      },
      extractedData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        documentNumber: 'ABC123456',
        expiryDate: '2030-12-31',
        nationality: 'US'
      },
      flags: verificationScore < 50 ? ['LOW_QUALITY_IMAGE', 'SUSPECTED_TAMPERING'] : [],
      confidence: verificationScore / 100
    };

    return results;
  }

  // AML Transaction Monitoring
  async monitorTransaction(transaction) {
    const alertId = crypto.randomUUID();
    let alertLevel = 'LOW';
    const triggers = [];

    // Check transaction amount
    if (parseFloat(transaction.amount) > 10) { // Large transaction threshold
      triggers.push('LARGE_TRANSACTION');
      alertLevel = 'MEDIUM';
    }

    // Check velocity (multiple transactions in short time)
    const recentTransactions = this.getRecentTransactions(transaction.walletAddress, 24); // 24 hours
    if (recentTransactions.length > 10) {
      triggers.push('HIGH_VELOCITY');
      alertLevel = 'HIGH';
    }

    // Check wallet risk score
    const riskAssessment = this.riskScores.get(transaction.walletAddress);
    if (riskAssessment && riskAssessment.riskLevel === 'HIGH') {
      triggers.push('HIGH_RISK_WALLET');
      alertLevel = 'HIGH';
    }

    // Unusual time patterns
    const hour = new Date(transaction.timestamp).getHours();
    if (hour < 6 || hour > 23) { // Late night/early morning
      triggers.push('UNUSUAL_TIME_PATTERN');
      if (alertLevel === 'LOW') alertLevel = 'MEDIUM';
    }

    if (triggers.length > 0) {
      const alert = {
        id: alertId,
        transactionId: transaction.id,
        walletAddress: transaction.walletAddress,
        alertLevel,
        triggers,
        amount: transaction.amount,
        currency: transaction.currency,
        timestamp: new Date().toISOString(),
        status: 'OPEN',
        requiresAction: alertLevel === 'HIGH'
      };

      this.amlAlerts.set(alertId, alert);
      return alert;
    }

    return null; // No alert needed
  }

  getRecentTransactions(walletAddress, hours) {
    // Mock implementation - in production, query actual transactions
    const count = Math.floor(Math.random() * 20);
    return Array.from({ length: count }, (_, i) => ({
      id: `tx_${i}`,
      timestamp: new Date(Date.now() - Math.random() * hours * 60 * 60 * 1000)
    }));
  }

  // Get KYC status for a wallet
  getKYCStatus(walletAddress) {
    const submissions = Array.from(this.kycSubmissions.values())
      .filter(sub => sub.walletAddress === walletAddress)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const latestSubmission = submissions[0];

    return {
      walletAddress,
      kycStatus: latestSubmission ? latestSubmission.status : 'NOT_SUBMITTED',
      lastSubmission: latestSubmission ? {
        id: latestSubmission.id,
        status: latestSubmission.status,
        submittedAt: latestSubmission.submittedAt,
        type: latestSubmission.type
      } : null,
      verificationLevel: this.getVerificationLevel(latestSubmission),
      withdrawalLimits: this.getWithdrawalLimits(latestSubmission),
      nextSteps: this.getNextSteps(latestSubmission)
    };
  }

  getVerificationLevel(submission) {
    if (!submission) return 'NONE';
    
    switch (submission.status) {
      case 'APPROVED': return 'VERIFIED';
      case 'PENDING_REVIEW':
      case 'PENDING_MANUAL_REVIEW': return 'PENDING';
      case 'REJECTED': return 'FAILED';
      default: return 'NONE';
    }
  }

  getWithdrawalLimits(submission) {
    const baseLimit = { daily: '0.1', monthly: '1.0', currency: 'ETH' };
    
    if (!submission || submission.status !== 'APPROVED') {
      return baseLimit;
    }

    // Verified users get higher limits
    return {
      daily: '10.0',
      monthly: '100.0',
      currency: 'ETH'
    };
  }

  getNextSteps(submission) {
    if (!submission) {
      return ['Submit identity document for verification'];
    }

    switch (submission.status) {
      case 'PENDING_REVIEW':
        return ['Wait for automated verification to complete'];
      case 'PENDING_MANUAL_REVIEW':
        return ['Manual review in progress', 'Typical review time: 1-3 business days'];
      case 'REJECTED':
        return ['Resubmit with higher quality documents', 'Contact support if needed'];
      case 'APPROVED':
        return ['Verification complete', 'Enjoy higher withdrawal limits'];
      default:
        return ['Submit required documents'];
    }
  }

  // Compliance reporting
  generateComplianceReport(walletAddress) {
    const kycStatus = this.getKYCStatus(walletAddress);
    const riskAssessment = this.riskScores.get(walletAddress);
    const alerts = Array.from(this.amlAlerts.values())
      .filter(alert => alert.walletAddress === walletAddress);

    return {
      walletAddress,
      reportDate: new Date().toISOString(),
      kycCompliance: {
        status: kycStatus.kycStatus,
        verificationLevel: kycStatus.verificationLevel,
        compliant: kycStatus.kycStatus === 'APPROVED'
      },
      amlCompliance: {
        riskLevel: riskAssessment ? riskAssessment.riskLevel : 'UNKNOWN',
        alertCount: alerts.length,
        highRiskAlerts: alerts.filter(a => a.alertLevel === 'HIGH').length,
        lastRiskAssessment: riskAssessment ? riskAssessment.timestamp : null
      },
      recommendations: this.generateComplianceRecommendations(kycStatus, riskAssessment, alerts)
    };
  }

  generateComplianceRecommendations(kycStatus, riskAssessment, alerts) {
    const recommendations = [];

    if (kycStatus.kycStatus !== 'APPROVED') {
      recommendations.push({
        priority: 'HIGH',
        action: 'COMPLETE_KYC',
        description: 'Complete KYC verification to ensure compliance'
      });
    }

    if (riskAssessment && riskAssessment.riskLevel === 'HIGH') {
      recommendations.push({
        priority: 'HIGH',
        action: 'ENHANCED_MONITORING',
        description: 'Enable enhanced transaction monitoring'
      });
    }

    const openHighAlerts = alerts.filter(a => a.alertLevel === 'HIGH' && a.status === 'OPEN');
    if (openHighAlerts.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'REVIEW_ALERTS',
        description: `Review and resolve ${openHighAlerts.length} high-priority AML alerts`
      });
    }

    return recommendations;
  }

  // Administrative functions
  getSystemStats() {
    const totalSubmissions = this.kycSubmissions.size;
    const approvedSubmissions = Array.from(this.kycSubmissions.values())
      .filter(s => s.status === 'APPROVED').length;
    
    const totalAlerts = this.amlAlerts.size;
    const highRiskAlerts = Array.from(this.amlAlerts.values())
      .filter(a => a.alertLevel === 'HIGH').length;

    return {
      kyc: {
        totalSubmissions,
        approvedSubmissions,
        approvalRate: totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions * 100).toFixed(1) : 0,
        pendingReview: Array.from(this.kycSubmissions.values())
          .filter(s => s.status.includes('PENDING')).length
      },
      aml: {
        totalAlerts,
        highRiskAlerts,
        openAlerts: Array.from(this.amlAlerts.values())
          .filter(a => a.status === 'OPEN').length,
        totalRiskAssessments: this.riskScores.size
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = KYCAMLService;