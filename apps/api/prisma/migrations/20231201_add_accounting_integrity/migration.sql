-- Add DailyClose table for daily snapshots
CREATE TABLE "daily_closes" (
    "id" TEXT NOT NULL,
    "close_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "total_users" INTEGER NOT NULL DEFAULT 0,
    "total_transactions" INTEGER NOT NULL DEFAULT 0,
    "balances_snapshot" JSONB NOT NULL DEFAULT '{}',
    "deposits_summary" JSONB NOT NULL DEFAULT '{}',
    "withdrawals_summary" JSONB NOT NULL DEFAULT '{}',
    "bets_summary" JSONB NOT NULL DEFAULT '{}',
    "wins_summary" JSONB NOT NULL DEFAULT '{}',
    "bonuses_summary" JSONB NOT NULL DEFAULT '{}',
    "ggr_by_currency" JSONB NOT NULL DEFAULT '{}',
    "ngr_by_currency" JSONB NOT NULL DEFAULT '{}',
    "variance_from_previous" JSONB NOT NULL DEFAULT '{}',
    "unreconciled_count" INTEGER NOT NULL DEFAULT 0,
    "ledger_integrity_check" BOOLEAN NOT NULL DEFAULT false,
    "export_file_path" TEXT,
    "error_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "daily_closes_pkey" PRIMARY KEY ("id")
);

-- Add PaymentConfirmation table for reconciliation
CREATE TABLE "payment_confirmations" (
    "id" TEXT NOT NULL,
    "deposit_intent_id" TEXT,
    "withdrawal_request_id" TEXT,
    "provider_reference" TEXT NOT NULL,
    "tx_hash" TEXT,
    "amount" DECIMAL(20,8) NOT NULL,
    "currency" "Currency" NOT NULL,
    "confirmations" INTEGER NOT NULL DEFAULT 0,
    "confirmation_data" JSONB NOT NULL DEFAULT '{}',
    "reconciliation_status" TEXT NOT NULL DEFAULT 'PENDING',
    "reconciled_transaction_id" TEXT,
    "reconciled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_confirmations_pkey" PRIMARY KEY ("id")
);

-- Add ReconciliationEntry table for tracking discrepancies
CREATE TABLE "reconciliation_entries" (
    "id" TEXT NOT NULL,
    "daily_close_id" TEXT,
    "entry_type" TEXT NOT NULL, -- DEPOSIT, WITHDRAWAL, GAME, BONUS
    "reference_id" TEXT NOT NULL,
    "expected_amount" DECIMAL(20,8) NOT NULL,
    "actual_amount" DECIMAL(20,8) NOT NULL,
    "variance" DECIMAL(20,8) NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNRECONCILED',
    "notes" TEXT,
    "resolved_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciliation_entries_pkey" PRIMARY KEY ("id")
);

-- Add LedgerSnapshot table for point-in-time balances
CREATE TABLE "ledger_snapshots" (
    "id" TEXT NOT NULL,
    "daily_close_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance" DECIMAL(20,8) NOT NULL,
    "locked" DECIMAL(20,8) NOT NULL,
    "total_deposits" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "total_withdrawals" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "total_bets" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "total_wins" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "total_bonuses" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_snapshots_pkey" PRIMARY KEY ("id")
);

-- Create unique indices for data integrity
CREATE UNIQUE INDEX "daily_closes_close_date_key" ON "daily_closes"("close_date");
CREATE INDEX "daily_closes_status_idx" ON "daily_closes"("status");
CREATE INDEX "daily_closes_created_at_idx" ON "daily_closes"("created_at");

-- Payment confirmation indices
CREATE INDEX "payment_confirmations_deposit_intent_id_idx" ON "payment_confirmations"("deposit_intent_id");
CREATE INDEX "payment_confirmations_withdrawal_request_id_idx" ON "payment_confirmations"("withdrawal_request_id");
CREATE INDEX "payment_confirmations_provider_reference_idx" ON "payment_confirmations"("provider_reference");
CREATE INDEX "payment_confirmations_reconciliation_status_idx" ON "payment_confirmations"("reconciliation_status");
CREATE INDEX "payment_confirmations_tx_hash_idx" ON "payment_confirmations"("tx_hash");

-- Reconciliation indices
CREATE INDEX "reconciliation_entries_daily_close_id_idx" ON "reconciliation_entries"("daily_close_id");
CREATE INDEX "reconciliation_entries_reference_id_idx" ON "reconciliation_entries"("reference_id");
CREATE INDEX "reconciliation_entries_status_idx" ON "reconciliation_entries"("status");
CREATE INDEX "reconciliation_entries_entry_type_idx" ON "reconciliation_entries"("entry_type");

-- Ledger snapshot indices  
CREATE INDEX "ledger_snapshots_daily_close_id_idx" ON "ledger_snapshots"("daily_close_id");
CREATE INDEX "ledger_snapshots_user_id_idx" ON "ledger_snapshots"("user_id");
CREATE INDEX "ledger_snapshots_currency_idx" ON "ledger_snapshots"("currency");
CREATE UNIQUE INDEX "ledger_snapshots_daily_close_user_currency_key" ON "ledger_snapshots"("daily_close_id", "user_id", "currency");

-- Add foreign key constraints
ALTER TABLE "payment_confirmations" ADD CONSTRAINT "payment_confirmations_deposit_intent_id_fkey" FOREIGN KEY ("deposit_intent_id") REFERENCES "deposit_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payment_confirmations" ADD CONSTRAINT "payment_confirmations_withdrawal_request_id_fkey" FOREIGN KEY ("withdrawal_request_id") REFERENCES "withdrawal_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payment_confirmations" ADD CONSTRAINT "payment_confirmations_reconciled_transaction_id_fkey" FOREIGN KEY ("reconciled_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "reconciliation_entries" ADD CONSTRAINT "reconciliation_entries_daily_close_id_fkey" FOREIGN KEY ("daily_close_id") REFERENCES "daily_closes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ledger_snapshots" ADD CONSTRAINT "ledger_snapshots_daily_close_id_fkey" FOREIGN KEY ("daily_close_id") REFERENCES "daily_closes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_snapshots" ADD CONSTRAINT "ledger_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add integrity indices for existing tables
CREATE INDEX "transactions_user_id_type_created_at_idx" ON "transactions"("user_id", "type", "created_at");
CREATE INDEX "transactions_amount_currency_idx" ON "transactions"("amount", "currency");
CREATE INDEX "ledger_entries_credit_debit_amount_idx" ON "ledger_entries"("credit_account_id", "debit_account_id", "amount");
CREATE INDEX "ledger_accounts_balance_locked_idx" ON "ledger_accounts"("balance", "locked");

-- Add check constraints to prevent negative balances
ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_balance_non_negative" CHECK ("balance" >= 0);
ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_locked_non_negative" CHECK ("locked" >= 0);

-- Add transaction amount non-zero constraint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_non_zero" CHECK ("amount" != 0);

-- Add ledger entry amount positive constraint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_amount_positive" CHECK ("amount" > 0);