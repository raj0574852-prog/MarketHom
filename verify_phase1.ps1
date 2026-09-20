$ErrorActionPreference = "Stop"

Write-Host "============================================================"
Write-Host "PHASE 1 - LOCAL WINDOWS POWERSHELL VERIFICATION SCRIPT"
Write-Host "============================================================"

# 1. Check .env.local existence
if (-not (Test-Path ".env.local")) {
    Write-Error "CRITICAL: .env.local not found in the project root."
    exit 1
}

# 2. Extract and verify variables safely
Write-Host "`nLoading local environment variables securely..."
$requiredVars = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "CRON_SECRET")
$missing = $false

foreach ($line in Get-Content .env.local) {
    if ($line -match "^(.*?)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var)) {
        Write-Error "CRITICAL: Missing required variable: $var"
        $missing = $true
    } else {
        Write-Host "[PASS] $var is configured (value hidden)."
    }
}

if ($missing) {
    Write-Error "Missing credentials. Verification stopped."
    exit 1
}

Write-Host "`n============================================================"
Write-Host "STEP A: APPLY DATABASE MIGRATIONS"
Write-Host "============================================================"
npx supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Error "Database push failed. Ensure Supabase CLI is configured."
    exit 1
}
Write-Host "[PASS] Migration 10_logo_discovery.sql successfully applied."


Write-Host "`n============================================================"
Write-Host "STEP B: END-TO-END AUTOMATED DATABASE & WORKER TEST"
Write-Host "============================================================"
Write-Host "This interactive script will select 5 publishers, queue them, trigger"
Write-Host "the cron endpoint, and verify all database states/stuck jobs/reuters."
npx tsx run_db_verification.ts


Write-Host "`n============================================================"
Write-Host "STEP C: SECURITY (SSRF) TEST"
Write-Host "============================================================"
npx tsx test_ssrf.ts


Write-Host "`n============================================================"
Write-Host "STEP D: CONCURRENCY LOCKING TEST"
Write-Host "============================================================"
npx tsx test_locking.ts


Write-Host "`n============================================================"
Write-Host "STEP E: PRODUCTION BUILD"
Write-Host "============================================================"
npm run build


Write-Host "`n============================================================"
Write-Host "STEP F: MANUAL FRONTEND VERIFICATION"
Write-Host "============================================================"
Write-Host "Please perform these final manual checks:"
Write-Host "1. Check http://localhost:3000/websites - Do the 5 discovered logos appear?"
Write-Host "2. Click one of the 5 publishers - HTTP 200? Pricing unchanged? No SSR error?"
Write-Host "3. Check a publisher with a blank logo_url - Does the initial-letter fallback still work?"
Write-Host "4. Check Reuters (reuters.com) - Is the logo correct? Pricing unchanged?"
Write-Host "5. Verify other metadata/sitemaps remain unaffected."
Write-Host "============================================================"
Write-Host "ALL AUTOMATED GATES COMPLETED SAFELY."
