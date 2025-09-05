@echo off
echo ====================================
echo   CRYPTO CASINO - AUTO SETUP
echo ====================================

echo.
echo [1/6] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/6] Installing pnpm globally...
npm install -g pnpm
if %errorlevel% neq 0 (
    echo ERROR: Failed to install pnpm
    pause
    exit /b 1
)

echo.
echo [3/6] Verifying pnpm installation...
pnpm --version
if %errorlevel% neq 0 (
    echo ERROR: pnpm not working properly
    pause
    exit /b 1
)

echo.
echo [4/6] Installing project dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [5/6] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo Environment file created from .env.example
)

echo.
echo [6/6] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Docker not found! 
    echo Please install Docker Desktop from: https://docker.com/products/docker-desktop
    echo.
    echo You can continue without Docker, but some services won't work.
    pause
) else (
    echo Docker found - ready to start services!
)

echo.
echo ====================================
echo   SETUP COMPLETE!
echo ====================================
echo.
echo Next steps:
echo 1. Make sure Docker Desktop is running
echo 2. Run: make dev
echo    OR manually: docker-compose up -d
echo.
echo Available URLs after startup:
echo - Web App: http://localhost:3000
echo - API: http://localhost:3001/api/docs
echo - Grafana: http://localhost:3000 ^(admin/admin^)
echo.
pause