#!/usr/bin/env pwsh

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   CRYPTO CASINO - AUTO SETUP" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command exists
function Test-Command($cmdname) {
    try {
        Get-Command $cmdname -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Step 1: Check Node.js
Write-Host "[1/7] Checking Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check/Install pnpm
Write-Host "[2/7] Checking pnpm..." -ForegroundColor Yellow
if (Test-Command "pnpm") {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm found: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "Installing pnpm globally..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ pnpm installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 3: Install dependencies
Write-Host "[3/7] Installing project dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Setup environment
Write-Host "[4/7] Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Environment file created from .env.example" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Step 5: Check Docker
Write-Host "[5/7] Checking Docker..." -ForegroundColor Yellow
if (Test-Command "docker") {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
    
    # Check if Docker is running
    try {
        docker ps | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Docker found but not running. Please start Docker Desktop." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Docker not found!" -ForegroundColor Yellow
    Write-Host "Please install Docker Desktop from: https://docker.com/products/docker-desktop" -ForegroundColor Yellow
}

# Step 6: Check Make command
Write-Host "[6/7] Checking Make command..." -ForegroundColor Yellow
if (Test-Command "make") {
    Write-Host "✅ Make command available" -ForegroundColor Green
    $useMake = $true
} else {
    Write-Host "⚠️  Make command not found. Will use direct commands." -ForegroundColor Yellow
    $useMake = $false
}

# Step 7: Ready to start
Write-Host "[7/7] Setup complete!" -ForegroundColor Yellow

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   SETUP COMPLETE! 🎉" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""

if ($useMake) {
    Write-Host "1. Start the development environment:" -ForegroundColor White
    Write-Host "   make dev" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "1. Start Docker services:" -ForegroundColor White
    Write-Host "   docker-compose up -d" -ForegroundColor Green
    Write-Host ""
    Write-Host "2. Setup database:" -ForegroundColor White
    Write-Host "   pnpm --filter=@crypto-casino/api db:generate" -ForegroundColor Green
    Write-Host "   pnpm --filter=@crypto-casino/api db:migrate" -ForegroundColor Green
    Write-Host "   pnpm --filter=@crypto-casino/api db:seed" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. Start applications:" -ForegroundColor White
    Write-Host "   pnpm -w dev" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Available URLs after startup:" -ForegroundColor Yellow
Write-Host "🎰 Web App:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 API Docs:   http://localhost:3001/api/docs" -ForegroundColor Cyan
Write-Host "📊 Grafana:    http://localhost:3000 (admin/admin)" -ForegroundColor Cyan
Write-Host "📧 Mailhog:    http://localhost:8025" -ForegroundColor Cyan
Write-Host "💾 MinIO:      http://localhost:9001 (minioadmin/minioadmin123)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Demo users:" -ForegroundColor Yellow
Write-Host "👤 User:  demo@crypto-casino.local" -ForegroundColor White
Write-Host "👨‍💼 Admin: admin@crypto-casino.local" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"