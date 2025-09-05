# Accounting & Reconciliation Runbook

## Overview

This runbook provides comprehensive operational procedures for managing the crypto casino's accounting system, daily close processes, and reconciliation workflows. The system implements double-entry bookkeeping with strict invariants and automated reconciliation.

## 🎯 Key Concepts

### Double-Entry Bookkeeping
- Every transaction creates exactly 2 balanced ledger entries
- Credits must always equal debits system-wide
- No negative balances are permitted
- All operations are atomic and reversible

### Daily Close Process
- Automated D-1 snapshot of all account balances
- Financial summary calculation (GGR/NGR)
- Ledger integrity verification
- Variance analysis vs previous day
- CSV export generation

### Reconciliation
- Matches payment intents/confirmations with ledger entries
- Identifies and flags discrepancies
- Automated and manual resolution workflows

## 🔄 Daily Operations

### 1. Daily Close Process

#### Automatic Schedule
```bash
# Daily close runs automatically at 02:00 UTC for D-1
# Configured via cron/scheduler
```

#### Manual Trigger
```bash
# Trigger daily close via API
curl -X POST http://api:3001/admin/accounting/close/run \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2023-12-01",
    "force": false,
    "includeReconciliation": true
  }'
```

#### Check Status
```bash
# Check daily close status
curl -X GET "http://api:3001/admin/accounting/close/2023-12-01" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Check job status
curl -X GET "http://api:3001/admin/accounting/close/status/{jobId}" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Expected Outputs
1. **Balance snapshots** for all accounts
2. **Financial summary** (deposits, withdrawals, bets, wins, GGR, NGR)
3. **Integrity check** results
4. **CSV export** file
5. **Reconciliation status**

### 2. Reconciliation Process

#### Automatic Reconciliation
- Runs as part of daily close
- Processes all deposit intents and withdrawal requests
- Matches with corresponding ledger transactions

#### Manual Reconciliation
```bash
# Trigger manual reconciliation
curl -X POST http://api:3001/admin/accounting/reconcile/run \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2023-12-01",
    "type": "FULL",
    "force": false
  }'
```

#### Check Pending Items
```bash
# Get unreconciled items
curl -X GET "http://api:3001/admin/accounting/reconcile/pending?limit=50" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Resolve Reconciliation Entry
```bash
# Mark item as resolved
curl -X POST "http://api:3001/admin/accounting/reconcile/{entryId}/resolve" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution": "Manual adjustment completed - payment provider confirmed transaction"
  }'
```

### 3. Ledger Integrity Checks

#### Manual Integrity Check
```bash
# Run full ledger integrity verification
curl -X GET "http://api:3001/admin/accounting/ledger/integrity" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Expected Results
```json
{
  "isValid": true,
  "totalCredits": "1000000.00",
  "totalDebits": "1000000.00",
  "imbalance": "0.00",
  "accountImbalances": [],
  "timestamp": "2023-12-01T12:00:00.000Z"
}
```

## 🚨 Incident Response

### 1. Daily Close Failure

#### Symptoms
- Daily close job fails or times out
- Integrity check reports failures
- Missing or incomplete export files

#### Investigation Steps
1. **Check job status and logs**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/close/status/{jobId}"
   ```

2. **Review error details**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/close/{date}"
   ```

3. **Check system health**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/health"
   ```

#### Resolution Steps
1. **Identify root cause** (DB connectivity, data corruption, etc.)
2. **Fix underlying issue**
3. **Retry close with force flag**
   ```bash
   curl -X POST http://api:3001/admin/accounting/close/run \
     -d '{"date": "2023-12-01", "force": true}'
   ```

### 2. Ledger Imbalance Detected

#### Symptoms
- `ledger_imbalance_total` metric > 0
- Integrity check shows account imbalances
- Transaction processing failures

#### Investigation Steps
1. **Run detailed integrity check**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/ledger/integrity"
   ```

2. **Identify affected accounts**
   ```json
   {
     "accountImbalances": [
       {
         "accountId": "acc-123",
         "userId": "user-456",
         "currency": "USD",
         "storedBalance": "100.00",
         "calculatedBalance": "95.00",
         "imbalance": "5.00"
       }
     ]
   }
   ```

3. **Review transaction history**
   ```bash
   # Get user account details
   curl -X GET "http://api:3001/admin/accounting/ledger/balance/{userId}"
   ```

#### Resolution Steps
1. **Stop all transaction processing** if imbalance is significant
2. **Investigate transaction history** for affected accounts
3. **Identify missing or corrupted entries**
4. **Create corrective journal entries** (requires development)
5. **Re-run integrity verification**

### 3. Reconciliation Discrepancies

#### Symptoms
- High number of unreconciled items
- Payment confirmations without ledger entries
- Amount mismatches

#### Investigation Steps
1. **Review unreconciled items**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/reconcile/pending"
   ```

2. **Check reconciliation stats**
   ```bash
   curl -X GET "http://api:3001/admin/accounting/reconcile/stats"
   ```

3. **Review payment provider data**

#### Resolution Steps
1. **Verify payment provider confirmations**
2. **Check for missing webhook callbacks**
3. **Manually create missing ledger entries** (if confirmed)
4. **Mark items as resolved** with appropriate notes

## 📊 Monitoring & Alerting

### Key Metrics

#### Prometheus Metrics
```promql
# Ledger imbalance alert
ledger_imbalance_total > 0.01

# Daily close failure alert
increase(daily_close_failed_total[1d]) > 0

# High unreconciled items
reconciliation_unreconciled_items > 100

# Transaction failure rate
rate(ledger_transaction_failures_total[5m]) > 0.1
```

#### Grafana Dashboards
1. **Accounting Overview**
   - System-wide balances by currency
   - Daily close status and timing
   - Reconciliation metrics

2. **Ledger Health**
   - Integrity check results
   - Account imbalances
   - Transaction success rates

3. **Financial Summary**
   - Daily GGR/NGR trends
   - Transaction volumes
   - Revenue metrics

### Alert Thresholds

#### Critical Alerts
- Ledger imbalance > $0.01
- Daily close failure
- Integrity check failure
- Queue processing stopped

#### Warning Alerts
- Unreconciled items > 50
- Transaction failure rate > 5%
- Daily close duration > 10 minutes

## 🛠️ Maintenance Procedures

### Weekly Tasks
1. **Review reconciliation stats**
2. **Analyze integrity check trends**
3. **Export financial reports**
4. **Archive old daily close files**

### Monthly Tasks
1. **Full ledger audit**
2. **Performance optimization review**
3. **Queue maintenance**
4. **Backup verification**

### Quarterly Tasks
1. **Disaster recovery test**
2. **Compliance report generation**
3. **System capacity review**
4. **Security audit**

## 📋 Troubleshooting Guide

### Common Issues

#### 1. Transaction Stuck in Pending
**Symptoms:** High queue wait times, transactions not processing
**Resolution:**
```bash
# Check queue status
curl -X GET "http://api:3001/admin/accounting/health"

# Clear failed jobs (if safe)
# Restart processing workers
```

#### 2. Export File Generation Failed
**Symptoms:** Missing CSV files, export errors
**Resolution:**
```bash
# Manually trigger export
curl -X GET "http://api:3001/admin/accounting/export/daily-close/{date}"

# Check file system permissions
# Verify export directory exists
```

#### 3. Database Lock Timeouts
**Symptoms:** Transaction timeouts, serialization errors
**Resolution:**
- Check for long-running queries
- Optimize concurrent transaction handling
- Consider increasing timeout values

#### 4. Payment Provider Sync Issues
**Symptoms:** Missing confirmations, webhook failures
**Resolution:**
- Verify webhook endpoint availability
- Check payment provider API status
- Manually reconcile confirmed payments

## 🔐 Security Considerations

### Access Control
- Daily close operations require ADMIN role
- Reconciliation requires ADMIN or COMPLIANCE role
- All operations are logged in audit trail

### Data Integrity
- All financial data is encrypted at rest
- Checksums verify export file integrity
- Database backups include point-in-time recovery

### Compliance
- Complete audit trail of all operations
- Immutable transaction records
- Regular compliance reporting

## 📞 Escalation Procedures

### Level 1 (Operations)
- Monitor dashboards
- Execute standard procedures
- Resolve routine reconciliation items

### Level 2 (Engineering)
- Investigate system failures
- Perform integrity repairs
- Optimize performance issues

### Level 3 (Senior Leadership)
- Major system outages
- Significant financial discrepancies
- Compliance violations

### Emergency Contacts
- **Operations:** operations@crypto-casino.com
- **Engineering:** engineering@crypto-casino.com
- **Compliance:** compliance@crypto-casino.com
- **Executive:** executive@crypto-casino.com

## 📚 Additional Resources

### API Documentation
- Full API docs: `http://api:3001/api/docs`
- Metrics endpoint: `http://api:3001/metrics`
- Health check: `http://api:3001/health`

### Monitoring URLs
- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`

### Database Access
```bash
# Connect to accounting database
docker exec -it crypto-casino-postgres psql -U crypto_casino -d crypto_casino

# Key tables to monitor
\dt daily_closes
\dt reconciliation_entries
\dt ledger_accounts
\dt transactions
```

### Log Analysis
```bash
# View accounting service logs
docker logs -f crypto-casino-api | grep -i accounting

# Search for specific errors
docker logs crypto-casino-api 2>&1 | grep -i "ledger\|integrity\|reconcil"
```

---

**Last Updated:** December 2023  
**Document Version:** 1.0  
**Review Schedule:** Monthly