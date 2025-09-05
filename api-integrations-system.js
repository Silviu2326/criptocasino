const crypto = require('crypto');
const EventEmitter = require('events');

class APIIntegrationsSystem extends EventEmitter {
  constructor() {
    super();
    this.integrations = new Map();
    this.webhooks = new Map();
    this.apiKeys = new Map();
    this.rateLimits = new Map();
    this.integrationConfigs = this.initializeIntegrationConfigs();
    this.activeConnections = new Map();
    
    this.initializeIntegrations();
    this.startHealthChecks();
  }

  initializeIntegrationConfigs() {
    return {
      // Payment Processors
      coinbase: {
        name: 'Coinbase Commerce',
        type: 'payment',
        enabled: true,
        endpoints: {
          base: 'https://api.commerce.coinbase.com',
          charges: '/charges',
          events: '/events'
        },
        features: ['crypto_payments', 'webhooks', 'refunds'],
        supportedCurrencies: ['BTC', 'ETH', 'LTC', 'BCH'],
        rateLimit: { requests: 1000, window: 3600000 } // 1000 req/hour
      },

      binance: {
        name: 'Binance Pay',
        type: 'payment',
        enabled: true,
        endpoints: {
          base: 'https://bpay.binanceapi.com',
          orders: '/binancepay/openapi/v2/order',
          query: '/binancepay/openapi/v2/order/query'
        },
        features: ['crypto_payments', 'instant_settlement', 'multi_currency'],
        supportedCurrencies: ['BNB', 'BTC', 'ETH', 'USDT', 'USDC'],
        rateLimit: { requests: 1200, window: 60000 } // 1200 req/min
      },

      // Blockchain Services
      moralis: {
        name: 'Moralis Web3 API',
        type: 'blockchain',
        enabled: true,
        endpoints: {
          base: 'https://deep-index.moralis.io/api/v2',
          balance: '/{address}/balance',
          tokens: '/{address}/erc20',
          transactions: '/{address}'
        },
        features: ['balance_checking', 'transaction_history', 'nft_data'],
        supportedNetworks: ['ethereum', 'polygon', 'bsc', 'avalanche'],
        rateLimit: { requests: 25000, window: 86400000 } // 25k req/day
      },

      alchemy: {
        name: 'Alchemy Blockchain API',
        type: 'blockchain',
        enabled: true,
        endpoints: {
          base: 'https://eth-mainnet.g.alchemy.com/v2',
          webhook: '/webhook',
          notify: '/notify'
        },
        features: ['real_time_notifications', 'enhanced_apis', 'nft_api'],
        supportedNetworks: ['ethereum', 'polygon', 'arbitrum', 'optimism'],
        rateLimit: { requests: 300, window: 1000 } // 300 req/sec
      },

      // Communication Services
      sendgrid: {
        name: 'SendGrid Email API',
        type: 'communication',
        enabled: true,
        endpoints: {
          base: 'https://api.sendgrid.com/v3',
          send: '/mail/send',
          templates: '/templates'
        },
        features: ['email_sending', 'templates', 'analytics'],
        rateLimit: { requests: 10000, window: 86400000 } // 10k req/day
      },

      twilio: {
        name: 'Twilio SMS API',
        type: 'communication',
        enabled: true,
        endpoints: {
          base: 'https://api.twilio.com/2010-04-01',
          messages: '/Messages.json',
          verify: '/Verify/Services'
        },
        features: ['sms_sending', '2fa_verification', 'phone_lookup'],
        rateLimit: { requests: 3600, window: 3600000 } // 3600 req/hour
      },

      // Analytics & Monitoring
      datadog: {
        name: 'Datadog Monitoring',
        type: 'monitoring',
        enabled: true,
        endpoints: {
          base: 'https://api.datadoghq.com/api/v1',
          metrics: '/series',
          events: '/events',
          logs: '/logs'
        },
        features: ['metrics_tracking', 'alerting', 'log_management'],
        rateLimit: { requests: 300, window: 3600000 } // 300 req/hour
      },

      mixpanel: {
        name: 'Mixpanel Analytics',
        type: 'analytics',
        enabled: true,
        endpoints: {
          base: 'https://api.mixpanel.com',
          track: '/track',
          engage: '/engage',
          export: '/export'
        },
        features: ['event_tracking', 'user_analytics', 'cohort_analysis'],
        rateLimit: { requests: 1000, window: 3600000 } // 1000 req/hour
      },

      // KYC Services
      jumio: {
        name: 'Jumio KYC',
        type: 'compliance',
        enabled: true,
        endpoints: {
          base: 'https://netverify.com/api/v4',
          initiate: '/initiate',
          callback: '/callback'
        },
        features: ['identity_verification', 'document_scanning', 'biometric_matching'],
        rateLimit: { requests: 100, window: 60000 } // 100 req/min
      },

      onfido: {
        name: 'Onfido Identity Verification',
        type: 'compliance',
        enabled: true,
        endpoints: {
          base: 'https://api.onfido.com/v3.6',
          applicants: '/applicants',
          documents: '/documents',
          checks: '/checks'
        },
        features: ['document_verification', 'facial_verification', 'watchlist_screening'],
        rateLimit: { requests: 300, window: 60000 } // 300 req/min
      },

      // Social Media
      discord: {
        name: 'Discord Bot API',
        type: 'social',
        enabled: true,
        endpoints: {
          base: 'https://discord.com/api/v10',
          channels: '/channels',
          messages: '/messages',
          guilds: '/guilds'
        },
        features: ['bot_messaging', 'community_management', 'role_assignment'],
        rateLimit: { requests: 50, window: 1000 } // 50 req/sec
      },

      telegram: {
        name: 'Telegram Bot API',
        type: 'social',
        enabled: true,
        endpoints: {
          base: 'https://api.telegram.org/bot',
          sendMessage: '/sendMessage',
          getUpdates: '/getUpdates'
        },
        features: ['bot_messaging', 'group_management', 'inline_keyboards'],
        rateLimit: { requests: 30, window: 1000 } // 30 req/sec
      }
    };
  }

  // Initialize all integrations
  initializeIntegrations() {
    Object.entries(this.integrationConfigs).forEach(([integrationId, config]) => {
      if (config.enabled) {
        this.setupIntegration(integrationId, config);
      }
    });
  }

  // Setup individual integration
  setupIntegration(integrationId, config) {
    const integration = {
      id: integrationId,
      config,
      status: 'initializing',
      lastHealthCheck: null,
      errorCount: 0,
      successCount: 0,
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0,
        lastRequestTime: null
      },
      rateLimitStatus: {
        remaining: config.rateLimit.requests,
        resetTime: Date.now() + config.rateLimit.window
      }
    };

    this.integrations.set(integrationId, integration);
    this.initializeRateLimit(integrationId, config.rateLimit);

    // Setup integration-specific initialization
    switch (config.type) {
      case 'payment':
        this.initializePaymentProcessor(integrationId, integration);
        break;
      case 'blockchain':
        this.initializeBlockchainService(integrationId, integration);
        break;
      case 'communication':
        this.initializeCommunicationService(integrationId, integration);
        break;
      case 'monitoring':
        this.initializeMonitoringService(integrationId, integration);
        break;
      case 'compliance':
        this.initializeComplianceService(integrationId, integration);
        break;
      case 'social':
        this.initializeSocialService(integrationId, integration);
        break;
    }

    integration.status = 'active';
    this.emit('integrationInitialized', { integrationId, integration });
  }

  // Initialize rate limiting
  initializeRateLimit(integrationId, rateLimit) {
    this.rateLimits.set(integrationId, {
      requests: 0,
      windowStart: Date.now(),
      limit: rateLimit.requests,
      window: rateLimit.window
    });
  }

  // Check rate limit before making request
  checkRateLimit(integrationId) {
    const rateLimit = this.rateLimits.get(integrationId);
    if (!rateLimit) return true;

    const now = Date.now();
    
    // Reset window if expired
    if (now - rateLimit.windowStart >= rateLimit.window) {
      rateLimit.requests = 0;
      rateLimit.windowStart = now;
    }

    // Check if within limit
    if (rateLimit.requests >= rateLimit.limit) {
      return false;
    }

    rateLimit.requests++;
    return true;
  }

  // Make API request with error handling and metrics
  async makeAPIRequest(integrationId, endpoint, options = {}) {
    const integration = this.integrations.get(integrationId);
    if (!integration || integration.status !== 'active') {
      throw new Error(`Integration ${integrationId} is not available`);
    }

    // Check rate limit
    if (!this.checkRateLimit(integrationId)) {
      throw new Error(`Rate limit exceeded for ${integrationId}`);
    }

    const startTime = Date.now();
    integration.metrics.totalRequests++;
    integration.metrics.lastRequestTime = new Date();

    try {
      // Simulate API request (in production, would use actual HTTP client)
      const response = await this.simulateAPIRequest(integrationId, endpoint, options);
      
      const responseTime = Date.now() - startTime;
      integration.metrics.successfulRequests++;
      integration.successCount++;
      
      // Update average response time
      integration.metrics.avgResponseTime = (
        (integration.metrics.avgResponseTime * (integration.metrics.successfulRequests - 1)) + responseTime
      ) / integration.metrics.successfulRequests;

      this.emit('apiRequestSuccess', {
        integrationId,
        endpoint,
        responseTime,
        response
      });

      return response;

    } catch (error) {
      integration.metrics.failedRequests++;
      integration.errorCount++;
      
      this.emit('apiRequestError', {
        integrationId,
        endpoint,
        error: error.message,
        responseTime: Date.now() - startTime
      });

      // Handle different types of errors
      if (error.status === 429) {
        // Rate limited
        await this.handleRateLimit(integrationId);
      } else if (error.status >= 500) {
        // Server error - potentially retry
        return await this.retryRequest(integrationId, endpoint, options);
      }

      throw error;
    }
  }

  // Simulate API request (replace with actual implementation)
  async simulateAPIRequest(integrationId, endpoint, options) {
    const integration = this.integrations.get(integrationId);
    const baseDelay = 100 + Math.random() * 200; // 100-300ms base delay
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, baseDelay));
    
    // Simulate occasional errors (5% failure rate)
    if (Math.random() < 0.05) {
      const errorTypes = [
        { status: 429, message: 'Rate limit exceeded' },
        { status: 500, message: 'Internal server error' },
        { status: 503, message: 'Service unavailable' }
      ];
      
      const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const apiError = new Error(error.message);
      apiError.status = error.status;
      throw apiError;
    }

    // Return mock successful response
    return {
      success: true,
      data: this.generateMockResponse(integrationId, endpoint, options),
      timestamp: new Date(),
      requestId: crypto.randomBytes(8).toString('hex')
    };
  }

  generateMockResponse(integrationId, endpoint, options) {
    const config = this.integrationConfigs[integrationId];
    
    switch (config.type) {
      case 'payment':
        return this.generatePaymentResponse(integrationId, endpoint);
      case 'blockchain':
        return this.generateBlockchainResponse(integrationId, endpoint);
      case 'communication':
        return this.generateCommunicationResponse(integrationId, endpoint);
      default:
        return { message: 'Success', endpoint, integrationId };
    }
  }

  generatePaymentResponse(integrationId, endpoint) {
    if (endpoint.includes('charges') || endpoint.includes('order')) {
      return {
        id: `charge_${crypto.randomBytes(8).toString('hex')}`,
        amount: '0.001',
        currency: 'ETH',
        status: 'pending',
        checkout_url: `https://commerce.coinbase.com/charges/${crypto.randomBytes(8).toString('hex')}`,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    }
    return { status: 'success' };
  }

  generateBlockchainResponse(integrationId, endpoint) {
    if (endpoint.includes('balance')) {
      return {
        balance: (Math.random() * 10).toFixed(8),
        currency: 'ETH',
        address: '0x' + crypto.randomBytes(20).toString('hex')
      };
    } else if (endpoint.includes('transactions')) {
      return {
        transactions: Array(5).fill(null).map(() => ({
          hash: '0x' + crypto.randomBytes(32).toString('hex'),
          value: (Math.random() * 1).toFixed(8),
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        }))
      };
    }
    return { status: 'success' };
  }

  generateCommunicationResponse(integrationId, endpoint) {
    if (endpoint.includes('send') || endpoint.includes('messages')) {
      return {
        message_id: crypto.randomBytes(8).toString('hex'),
        status: 'sent',
        timestamp: new Date().toISOString()
      };
    }
    return { status: 'success' };
  }

  // Retry failed requests with exponential backoff
  async retryRequest(integrationId, endpoint, options, attempt = 1, maxAttempts = 3) {
    if (attempt > maxAttempts) {
      throw new Error(`Max retry attempts reached for ${integrationId}`);
    }

    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      return await this.makeAPIRequest(integrationId, endpoint, options);
    } catch (error) {
      if (attempt < maxAttempts && error.status >= 500) {
        return await this.retryRequest(integrationId, endpoint, options, attempt + 1, maxAttempts);
      }
      throw error;
    }
  }

  // Handle rate limit exceeded
  async handleRateLimit(integrationId) {
    const integration = this.integrations.get(integrationId);
    const rateLimit = this.rateLimits.get(integrationId);
    
    if (rateLimit) {
      const waitTime = rateLimit.window - (Date.now() - rateLimit.windowStart);
      
      this.emit('rateLimitHit', {
        integrationId,
        waitTime,
        resetTime: new Date(Date.now() + waitTime)
      });

      // Temporarily disable integration until rate limit resets
      integration.status = 'rate_limited';
      
      setTimeout(() => {
        integration.status = 'active';
        rateLimit.requests = 0;
        rateLimit.windowStart = Date.now();
        
        this.emit('rateLimitReset', { integrationId });
      }, waitTime);
    }
  }

  // Integration-specific initialization methods
  initializePaymentProcessor(integrationId, integration) {
    // Setup webhook endpoints for payment notifications
    this.setupWebhook(integrationId, 'payment_update', '/webhooks/payment');
    
    // Initialize supported currencies
    integration.supportedCurrencies = integration.config.supportedCurrencies || [];
    
    this.emit('paymentProcessorReady', { integrationId });
  }

  initializeBlockchainService(integrationId, integration) {
    // Setup blockchain event listeners
    this.setupWebhook(integrationId, 'transaction_confirmed', '/webhooks/blockchain');
    this.setupWebhook(integrationId, 'block_mined', '/webhooks/blockchain');
    
    // Initialize supported networks
    integration.supportedNetworks = integration.config.supportedNetworks || [];
    
    this.emit('blockchainServiceReady', { integrationId });
  }

  initializeCommunicationService(integrationId, integration) {
    // Setup communication templates
    integration.templates = new Map();
    
    // Load default templates
    this.loadCommunicationTemplates(integrationId);
    
    this.emit('communicationServiceReady', { integrationId });
  }

  initializeMonitoringService(integrationId, integration) {
    // Setup metric collection
    integration.metricBuffers = new Map();
    
    // Start metric batching
    this.startMetricBatching(integrationId);
    
    this.emit('monitoringServiceReady', { integrationId });
  }

  initializeComplianceService(integrationId, integration) {
    // Setup compliance webhooks
    this.setupWebhook(integrationId, 'verification_complete', '/webhooks/compliance');
    
    // Initialize verification workflows
    integration.workflows = new Map();
    
    this.emit('complianceServiceReady', { integrationId });
  }

  initializeSocialService(integrationId, integration) {
    // Setup bot commands and handlers
    integration.botCommands = new Map();
    
    // Initialize social media connection
    this.setupSocialConnection(integrationId);
    
    this.emit('socialServiceReady', { integrationId });
  }

  // Webhook management
  setupWebhook(integrationId, eventType, endpoint) {
    const webhookId = `${integrationId}_${eventType}`;
    
    const webhook = {
      id: webhookId,
      integrationId,
      eventType,
      endpoint,
      isActive: true,
      lastTriggered: null,
      triggerCount: 0,
      failures: 0
    };
    
    this.webhooks.set(webhookId, webhook);
    
    this.emit('webhookRegistered', { webhookId, webhook });
  }

  // Process incoming webhook
  async processWebhook(webhookId, payload) {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook || !webhook.isActive) {
      throw new Error(`Webhook ${webhookId} not found or inactive`);
    }

    webhook.lastTriggered = new Date();
    webhook.triggerCount++;

    try {
      const result = await this.handleWebhookPayload(webhook, payload);
      
      this.emit('webhookProcessed', {
        webhookId,
        eventType: webhook.eventType,
        integrationId: webhook.integrationId,
        payload,
        result
      });

      return result;

    } catch (error) {
      webhook.failures++;
      
      this.emit('webhookError', {
        webhookId,
        error: error.message,
        payload
      });

      throw error;
    }
  }

  async handleWebhookPayload(webhook, payload) {
    switch (webhook.eventType) {
      case 'payment_update':
        return await this.handlePaymentWebhook(webhook.integrationId, payload);
      
      case 'transaction_confirmed':
        return await this.handleBlockchainWebhook(webhook.integrationId, payload);
      
      case 'verification_complete':
        return await this.handleComplianceWebhook(webhook.integrationId, payload);
      
      default:
        return { processed: true, webhook: webhook.id };
    }
  }

  async handlePaymentWebhook(integrationId, payload) {
    // Process payment update
    this.emit('paymentStatusChanged', {
      integrationId,
      paymentId: payload.id,
      status: payload.status,
      amount: payload.amount,
      currency: payload.currency
    });
    
    return { processed: true, type: 'payment_update' };
  }

  async handleBlockchainWebhook(integrationId, payload) {
    // Process blockchain event
    this.emit('blockchainEvent', {
      integrationId,
      txHash: payload.hash,
      blockNumber: payload.block_number,
      confirmations: payload.confirmations
    });
    
    return { processed: true, type: 'blockchain_event' };
  }

  async handleComplianceWebhook(integrationId, payload) {
    // Process compliance verification
    this.emit('verificationComplete', {
      integrationId,
      applicantId: payload.applicant_id,
      status: payload.status,
      result: payload.result
    });
    
    return { processed: true, type: 'verification_complete' };
  }

  // High-level integration methods
  
  // Send payment request
  async sendPaymentRequest(amount, currency, options = {}) {
    const paymentProcessors = Array.from(this.integrations.values())
      .filter(i => i.config.type === 'payment' && i.status === 'active')
      .filter(i => i.config.supportedCurrencies.includes(currency));

    if (paymentProcessors.length === 0) {
      throw new Error(`No available payment processor for ${currency}`);
    }

    // Use first available processor (could implement load balancing)
    const processor = paymentProcessors[0];
    
    return await this.makeAPIRequest(processor.id, '/charges', {
      method: 'POST',
      data: {
        amount,
        currency,
        ...options
      }
    });
  }

  // Get wallet balance
  async getWalletBalance(address, network = 'ethereum') {
    const blockchainServices = Array.from(this.integrations.values())
      .filter(i => i.config.type === 'blockchain' && i.status === 'active')
      .filter(i => i.config.supportedNetworks.includes(network));

    if (blockchainServices.length === 0) {
      throw new Error(`No available blockchain service for ${network}`);
    }

    const service = blockchainServices[0];
    
    return await this.makeAPIRequest(service.id, `/${address}/balance`, {
      method: 'GET',
      params: { network }
    });
  }

  // Send email
  async sendEmail(to, subject, content, template = null) {
    const emailServices = Array.from(this.integrations.values())
      .filter(i => i.config.type === 'communication' && i.status === 'active')
      .filter(i => i.config.features.includes('email_sending'));

    if (emailServices.length === 0) {
      throw new Error('No available email service');
    }

    const service = emailServices[0];
    
    return await this.makeAPIRequest(service.id, '/mail/send', {
      method: 'POST',
      data: {
        to,
        subject,
        content,
        template
      }
    });
  }

  // Start KYC verification
  async startKYCVerification(applicantData) {
    const kycServices = Array.from(this.integrations.values())
      .filter(i => i.config.type === 'compliance' && i.status === 'active');

    if (kycServices.length === 0) {
      throw new Error('No available KYC service');
    }

    const service = kycServices[0];
    
    return await this.makeAPIRequest(service.id, '/initiate', {
      method: 'POST',
      data: applicantData
    });
  }

  // Send social media message
  async sendSocialMessage(platform, channel, message) {
    const socialServices = Array.from(this.integrations.values())
      .filter(i => i.config.type === 'social' && i.status === 'active')
      .filter(i => i.id === platform);

    if (socialServices.length === 0) {
      throw new Error(`No available ${platform} service`);
    }

    const service = socialServices[0];
    
    return await this.makeAPIRequest(service.id, '/sendMessage', {
      method: 'POST',
      data: {
        channel,
        message
      }
    });
  }

  // Health check system
  startHealthChecks() {
    setInterval(async () => {
      await this.performHealthChecks();
    }, 60000); // Every minute
  }

  async performHealthChecks() {
    for (const [integrationId, integration] of this.integrations.entries()) {
      if (integration.status === 'active') {
        try {
          const startTime = Date.now();
          await this.makeAPIRequest(integrationId, '/health', { method: 'GET' });
          
          integration.lastHealthCheck = new Date();
          integration.healthStatus = 'healthy';
          
        } catch (error) {
          integration.healthStatus = 'unhealthy';
          integration.lastError = error.message;
          integration.lastErrorTime = new Date();
          
          this.emit('integrationUnhealthy', {
            integrationId,
            error: error.message,
            errorCount: integration.errorCount
          });
        }
      }
    }
  }

  // Load communication templates
  loadCommunicationTemplates(integrationId) {
    const templates = {
      welcome: {
        subject: 'Welcome to Crypto Casino',
        content: 'Thank you for joining us! Your account is now active.'
      },
      deposit_confirmed: {
        subject: 'Deposit Confirmed',
        content: 'Your deposit of {amount} {currency} has been confirmed.'
      },
      withdrawal_processed: {
        subject: 'Withdrawal Processed',
        content: 'Your withdrawal request has been processed successfully.'
      },
      kyc_approved: {
        subject: 'Account Verified',
        content: 'Your identity verification has been approved.'
      }
    };

    const integration = this.integrations.get(integrationId);
    if (integration) {
      Object.entries(templates).forEach(([name, template]) => {
        integration.templates.set(name, template);
      });
    }
  }

  // Start metric batching for monitoring services
  startMetricBatching(integrationId) {
    const integration = this.integrations.get(integrationId);
    if (!integration) return;

    setInterval(async () => {
      try {
        const metrics = this.collectMetrics();
        if (metrics.length > 0) {
          await this.makeAPIRequest(integrationId, '/metrics', {
            method: 'POST',
            data: { metrics }
          });
        }
      } catch (error) {
        console.error(`Failed to send metrics to ${integrationId}:`, error.message);
      }
    }, 60000); // Every minute
  }

  collectMetrics() {
    const metrics = [];
    
    // Collect integration metrics
    this.integrations.forEach((integration, integrationId) => {
      metrics.push({
        name: `integration.requests.total`,
        value: integration.metrics.totalRequests,
        tags: [`integration:${integrationId}`, `type:${integration.config.type}`],
        timestamp: Date.now()
      });
      
      metrics.push({
        name: `integration.requests.success_rate`,
        value: integration.metrics.totalRequests > 0 ? 
          (integration.metrics.successfulRequests / integration.metrics.totalRequests) * 100 : 0,
        tags: [`integration:${integrationId}`],
        timestamp: Date.now()
      });
      
      metrics.push({
        name: `integration.response_time`,
        value: integration.metrics.avgResponseTime,
        tags: [`integration:${integrationId}`],
        timestamp: Date.now()
      });
    });

    return metrics;
  }

  // Setup social connection
  setupSocialConnection(integrationId) {
    const integration = this.integrations.get(integrationId);
    if (!integration) return;

    // Setup basic bot commands
    const commands = {
      '/help': 'Show available commands',
      '/balance': 'Check your casino balance',
      '/support': 'Contact customer support',
      '/promotions': 'View current promotions'
    };

    Object.entries(commands).forEach(([command, description]) => {
      integration.botCommands.set(command, {
        description,
        handler: this.createBotCommandHandler(integrationId, command)
      });
    });
  }

  createBotCommandHandler(integrationId, command) {
    return async (context) => {
      switch (command) {
        case '/help':
          return 'Available commands: /balance, /support, /promotions';
        case '/balance':
          return 'Please log into the casino to check your balance.';
        case '/support':
          return 'Contact our support team at support@cryptocasino.com';
        case '/promotions':
          return 'Check out our latest promotions at https://casino.demo/promotions';
        default:
          return 'Unknown command. Type /help for available commands.';
      }
    };
  }

  // Get integration statistics
  getIntegrationStatistics() {
    const stats = {
      totalIntegrations: this.integrations.size,
      activeIntegrations: 0,
      unhealthyIntegrations: 0,
      integrationsByType: {},
      totalRequests: 0,
      successRate: 0,
      avgResponseTime: 0
    };

    let totalSuccessful = 0;
    let totalResponseTime = 0;
    let totalWithResponseTime = 0;

    this.integrations.forEach(integration => {
      const type = integration.config.type;
      
      if (integration.status === 'active') {
        stats.activeIntegrations++;
      }
      
      if (integration.healthStatus === 'unhealthy') {
        stats.unhealthyIntegrations++;
      }
      
      if (!stats.integrationsByType[type]) {
        stats.integrationsByType[type] = 0;
      }
      stats.integrationsByType[type]++;
      
      stats.totalRequests += integration.metrics.totalRequests;
      totalSuccessful += integration.metrics.successfulRequests;
      
      if (integration.metrics.avgResponseTime > 0) {
        totalResponseTime += integration.metrics.avgResponseTime;
        totalWithResponseTime++;
      }
    });

    stats.successRate = stats.totalRequests > 0 ? 
      (totalSuccessful / stats.totalRequests) * 100 : 0;
    
    stats.avgResponseTime = totalWithResponseTime > 0 ? 
      totalResponseTime / totalWithResponseTime : 0;

    return {
      ...stats,
      webhooks: this.webhooks.size,
      generatedAt: new Date().toISOString()
    };
  }

  // Get specific integration status
  getIntegrationStatus(integrationId) {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return null;
    }

    const rateLimit = this.rateLimits.get(integrationId);
    
    return {
      id: integrationId,
      name: integration.config.name,
      type: integration.config.type,
      status: integration.status,
      healthStatus: integration.healthStatus,
      lastHealthCheck: integration.lastHealthCheck,
      metrics: integration.metrics,
      rateLimit: rateLimit ? {
        remaining: rateLimit.limit - rateLimit.requests,
        resetTime: new Date(rateLimit.windowStart + rateLimit.window),
        limit: rateLimit.limit
      } : null,
      features: integration.config.features,
      lastError: integration.lastError,
      lastErrorTime: integration.lastErrorTime
    };
  }
}

module.exports = APIIntegrationsSystem;