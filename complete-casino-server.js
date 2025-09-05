const { EnhancedCasinoServer, BonusService } = require('./enhanced-casino-server');
const KYCAMLService = require('./kyc-aml-service');
const multer = require('multer');
const crypto = require('crypto');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
    }
  }
});

class CompleteCasinoServer extends EnhancedCasinoServer {
  constructor(port = 3002) {
    super(port);
    this.kycAML = new KYCAMLService();
    this.setupKYCAMLRoutes();
    this.setupAdminRoutes();
    
    // Override some existing routes with KYC/AML integration
    this.setupEnhancedUserRoutes();
  }

  setupKYCAMLRoutes() {
    // Get KYC status
    this.app.get('/api/kyc/status', this.requireAuth(), async (req, res) => {
      try {
        const status = this.kycAML.getKYCStatus(req.session.walletAddress);
        
        res.json({
          success: true,
          data: status
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Submit KYC document
    this.app.post('/api/kyc/submit', this.requireAuth(), upload.single('document'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No document file provided'
          });
        }

        const documentData = {
          type: req.body.type, // 'passport', 'drivers_license', 'id_card'
          base64Data: req.file.buffer.toString('base64'),
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype
        };

        const submission = await this.kycAML.submitKYCDocument(
          req.session.walletAddress,
          documentData
        );

        // Remove sensitive data from response
        const response = { ...submission };
        delete response.documentHash;

        res.json({
          success: true,
          data: response
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get wallet risk assessment
    this.app.get('/api/aml/risk-assessment', this.requireAuth(), async (req, res) => {
      try {
        const assessment = await this.kycAML.assessWalletRisk(req.session.walletAddress);
        
        res.json({
          success: true,
          data: assessment
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get compliance report
    this.app.get('/api/compliance/report', this.requireAuth(), (req, res) => {
      try {
        const report = this.kycAML.generateComplianceReport(req.session.walletAddress);
        
        res.json({
          success: true,
          data: report
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // KYC requirements info
    this.app.get('/api/kyc/requirements', (req, res) => {
      res.json({
        success: true,
        data: {
          supportedDocuments: [
            {
              type: 'passport',
              name: 'Passport',
              description: 'Valid government-issued passport',
              requirements: ['Clear, high-resolution photo', 'All corners visible', 'No glare or shadows']
            },
            {
              type: 'drivers_license',
              name: 'Driver\'s License',
              description: 'Government-issued driver\'s license',
              requirements: ['Front and back photos required', 'Not expired', 'Clear and readable']
            },
            {
              type: 'id_card',
              name: 'National ID Card',
              description: 'Government-issued national ID',
              requirements: ['Front and back photos', 'Valid and not expired', 'Government seal visible']
            }
          ],
          verificationLevels: [
            {
              level: 'NONE',
              name: 'Unverified',
              withdrawalLimit: { daily: '0.1 ETH', monthly: '1.0 ETH' },
              features: ['Basic gaming', 'Limited withdrawals']
            },
            {
              level: 'VERIFIED',
              name: 'Fully Verified',
              withdrawalLimit: { daily: '10 ETH', monthly: '100 ETH' },
              features: ['All games access', 'Higher limits', 'Priority support', 'Exclusive bonuses']
            }
          ],
          processingTime: {
            automated: '5-15 minutes',
            manual: '1-3 business days'
          }
        }
      });
    });
  }

  setupEnhancedUserRoutes() {
    // Enhanced user profile with KYC/AML data
    this.app.get('/api/user/profile/enhanced', this.requireAuth(), async (req, res) => {
      try {
        const userProfile = await this.authService.getUserProfile(req.session.walletAddress);
        const kycStatus = this.kycAML.getKYCStatus(req.session.walletAddress);
        const riskAssessment = await this.kycAML.assessWalletRisk(req.session.walletAddress);
        const availableBonuses = this.bonusService.getAvailableBonuses(req.session.walletAddress);

        const enhancedProfile = {
          ...userProfile,
          kyc: kycStatus,
          security: {
            riskLevel: riskAssessment.riskLevel,
            lastRiskCheck: riskAssessment.timestamp,
            requiresManualReview: riskAssessment.requiresManualReview
          },
          bonuses: {
            available: availableBonuses.length,
            bonuses: availableBonuses
          },
          limits: kycStatus.withdrawalLimits,
          features: {
            canWithdraw: kycStatus.kycStatus === 'APPROVED',
            canDeposit: true,
            maxBetAmount: kycStatus.kycStatus === 'APPROVED' ? '5.0' : '0.1',
            vipAccess: kycStatus.kycStatus === 'APPROVED' && riskAssessment.riskLevel !== 'HIGH'
          }
        };

        res.json({
          success: true,
          data: enhancedProfile
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  setupAdminRoutes() {
    // Admin middleware (simplified - in production, use proper admin authentication)
    const requireAdmin = () => {
      return (req, res, next) => {
        const adminKey = req.headers['x-admin-key'];
        if (adminKey !== 'demo-admin-key') {
          return res.status(403).json({
            success: false,
            error: 'Admin access required'
          });
        }
        next();
      };
    };

    // Admin dashboard stats
    this.app.get('/api/admin/dashboard', requireAdmin(), (req, res) => {
      try {
        const kycAmlStats = this.kycAML.getSystemStats();
        const serverStats = {
          uptime: process.uptime(),
          activeSessions: this.authService.sessions.size,
          pendingNonces: this.authService.nonces.size,
          memoryUsage: process.memoryUsage()
        };

        res.json({
          success: true,
          data: {
            server: serverStats,
            kycAml: kycAmlStats,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Admin KYC submissions list
    this.app.get('/api/admin/kyc/submissions', requireAdmin(), (req, res) => {
      try {
        const submissions = Array.from(this.kycAML.kycSubmissions.values())
          .map(sub => ({
            id: sub.id,
            walletAddress: sub.walletAddress,
            type: sub.type,
            status: sub.status,
            submittedAt: sub.submittedAt,
            manualReviewRequired: sub.manualReviewRequired,
            autoVerificationScore: sub.autoVerificationResults?.overallScore
          }))
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, parseInt(req.query.limit) || 50);

        res.json({
          success: true,
          data: {
            submissions,
            total: this.kycAML.kycSubmissions.size
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Admin AML alerts
    this.app.get('/api/admin/aml/alerts', requireAdmin(), (req, res) => {
      try {
        const alerts = Array.from(this.kycAML.amlAlerts.values())
          .filter(alert => {
            if (req.query.status && alert.status !== req.query.status) return false;
            if (req.query.level && alert.alertLevel !== req.query.level) return false;
            return true;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, parseInt(req.query.limit) || 50);

        res.json({
          success: true,
          data: {
            alerts,
            total: this.kycAML.amlAlerts.size
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Admin approve/reject KYC
    this.app.post('/api/admin/kyc/:submissionId/review', requireAdmin(), (req, res) => {
      try {
        const { submissionId } = req.params;
        const { action, reason } = req.body; // action: 'approve' or 'reject'

        const submission = this.kycAML.kycSubmissions.get(submissionId);
        if (!submission) {
          return res.status(404).json({
            success: false,
            error: 'Submission not found'
          });
        }

        if (action === 'approve') {
          submission.status = 'APPROVED';
          submission.approvedAt = new Date().toISOString();
          submission.reviewedBy = 'admin'; // In production, use actual admin ID
        } else if (action === 'reject') {
          submission.status = 'REJECTED';
          submission.rejectedAt = new Date().toISOString();
          submission.rejectionReason = reason || 'Manual review failed';
          submission.reviewedBy = 'admin';
        }

        this.kycAML.kycSubmissions.set(submissionId, submission);

        res.json({
          success: true,
          data: {
            submissionId,
            newStatus: submission.status,
            reviewedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  // Override game bet methods to include AML monitoring
  requireAuth() {
    return async (req, res, next) => {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');

      if (!sessionId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const session = this.authService.validateSession(sessionId);

      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired session'
        });
      }

      req.session = session;

      // For bet endpoints, perform AML monitoring
      if (req.path.includes('/bet') && req.method === 'POST') {
        try {
          // Create transaction record for AML monitoring
          const transaction = {
            id: `tx_${Date.now()}`,
            walletAddress: session.walletAddress,
            amount: req.body.amount || '0',
            currency: req.body.currency || 'ETH',
            type: 'BET',
            timestamp: new Date().toISOString()
          };

          // Monitor transaction for AML alerts
          const alert = await this.kycAML.monitorTransaction(transaction);
          
          if (alert && alert.alertLevel === 'HIGH' && alert.requiresAction) {
            return res.status(403).json({
              success: false,
              error: 'Transaction blocked for review',
              reason: 'HIGH_RISK_ALERT',
              alertId: alert.id
            });
          }

          req.transaction = transaction;
          req.amlAlert = alert;
        } catch (error) {
          console.error('AML monitoring error:', error);
          // Don't block transaction due to monitoring error, but log it
        }
      }

      next();
    };
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`
🎰 =====================================
   CRYPTO CASINO v3.0 (COMPLETE)
=====================================

✅ Server running on: http://localhost:${this.port}
📖 API Documentation: http://localhost:${this.port}/api/docs  
🔍 Health Check: http://localhost:${this.port}/health
🔐 Web3 Auth: http://localhost:${this.port}/api/auth/wallets

🎮 PHASE 1 COMPLETE - MVP ENHANCED:
   ✅ Wallet Connect + Web3 Authentication
   ✅ 10 Provably Fair Games
   ✅ Basic Bonus System
   ✅ Automated KYC/AML System

🔐 SECURITY FEATURES:
   • Multi-wallet Web3 authentication
   • Automated document verification
   • Real-time AML transaction monitoring
   • Risk-based user scoring
   • Compliance reporting

🎮 AVAILABLE GAMES:
   • Dice • Coinflip • Crash • Roulette
   • Blackjack • Plinko • Mines • Wheel
   • Limbo • Hi-Lo

🎁 BONUS SYSTEM:
   • Welcome bonus (100% match)
   • Daily free spins
   • Weekly rakeback
   • Auto-applied bonuses

🛡️ COMPLIANCE:
   • KYC document verification
   • AML transaction monitoring
   • Risk assessment scoring
   • Regulatory reporting

👤 ADMIN PANEL:
   • Dashboard: http://localhost:${this.port}/api/admin/dashboard
   • Headers: x-admin-key: demo-admin-key

🚀 Ready for professional crypto gaming!
`);
    });
  }
}

// Export for use in other modules
module.exports = CompleteCasinoServer;

// Start server if run directly
if (require.main === module) {
  const server = new CompleteCasinoServer(3002);
  server.start();
}