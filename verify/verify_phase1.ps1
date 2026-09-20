$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "PHASE 1 - LOCAL WINDOWS POWERSHELL VERIFICATION SCRIPT"
Write-Host "=========================================================="

Write-Host "`nPHASE A — Environment"
if (-not (Test-Path "..\.env.local")) {
    Write-Error "TEST: FAIL`nREASON: .env.local not found in project root.`nRECOMMENDED ACTION: Create .env.local with required variables."
    exit 1
}

$requiredVars = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "CRON_SECRET")
$missing = $false

foreach ($line in Get-Content "..\.env.local") {
    if ($line -match "^(.*?)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var)) {
        $missing = $true
    }
}

if ($missing) {
    Write-Error "TEST: FAIL`nREASON: Missing required variables.`nRECOMMENDED ACTION: Ensure all 4 required credentials are in .env.local."
    exit 1
}
Write-Host "ENVIRONMENT: PASS"

Write-Host "`nPHASE B — Database Migration Check"
Push-Location ..
npx supabase db push
if ($LASTEXITCODE -ne 0) {
    Write-Error "TEST: FAIL`nREASON: Migration failed.`nRECOMMENDED ACTION: Check Supabase CLI configuration."
    exit 1
}
Write-Host "MIGRATION: PASS"

Write-Host "`nPHASE C, D, E, F, G, H, K, L, M — E2E Database & Cron Tests"
npx tsx verify\run_db_verification.ts
if ($LASTEXITCODE -ne 0) {
    Write-Error "Database verification script failed. Halting."
    exit 1
}

Write-Host "`nPHASE I — Locking"
npx tsx test_locking.ts
if ($LASTEXITCODE -ne 0) {
    Write-Error "TEST: FAIL`nREASON: test_locking.ts failed.`nRECOMMENDED ACTION: Check concurrency logs."
    exit 1
}
Write-Host "LOCKING: PASS"

Write-Host "`nPHASE J — SSRF"
npx tsx test_ssrf.ts
if ($LASTEXITCODE -ne 0) {
    Write-Error "TEST: FAIL`nREASON: test_ssrf.ts failed.`nRECOMMENDED ACTION: Check SSRF logs."
    exit 1
}
Write-Host "SSRF: PASS"

Write-Host "`nPHASE P — Build"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "TEST: FAIL`nREASON: npm run build failed.`nRECOMMENDED ACTION: Check build errors."
    exit 1
}
Write-Host "BUILD: PASS"

Write-Host "`nPHASE Q — Git safety"
$gitStatus = git status --porcelain
if ($gitStatus -match "\.env") {
    Write-Error "TEST: FAIL`nREASON: .env.local is not ignored.`nRECOMMENDED ACTION: Add .env.local to .gitignore."
    exit 1
}
Write-Host "GIT_SAFETY: PASS"

Pop-Location

Write-Host "`n=========================================================="
Write-Host "MANUAL VERIFICATIONS REQUIRED:"
Write-Host "PHASE N — Frontend: Check /websites for discovered logos, missing logos (fallback), Reuters logo, no cropping, no RSC error."
Write-Host "PHASE O — Business regression: Verify pricing, checkout, sheets sync, sitemap, indexing."
Write-Host "=========================================================="
Write-Host "`nIf manual checks pass, please reply to Antigravity with the following block:"
Write-Host "`nENVIRONMENT: PASS"
Write-Host "DATABASE: PASS"
Write-Host "MIGRATION: PASS"
Write-Host "5_PUBLISHER_E2E: PASS"
Write-Host "CRON_HTTP: PASS"
Write-Host "DISCOVERY: X/5 SUCCESS"
Write-Host "LOCKING: PASS"
Write-Host "SSRF: PASS"
Write-Host "STUCK_RECOVERY: PASS"
Write-Host "RETRY: PASS"
Write-Host "SHEETS_PRECEDENCE: PASS"
Write-Host "FRONTEND: PASS"
Write-Host "BUSINESS_REGRESSION: PASS"
Write-Host "BUILD: PASS"
Write-Host "GIT_SAFETY: PASS"
Write-Host "=========================================================="
