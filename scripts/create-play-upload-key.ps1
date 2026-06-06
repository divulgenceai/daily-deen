$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidDir = Join-Path $root "android"
$propertiesPath = Join-Path $androidDir "key.properties"
$keystorePath = Join-Path $androidDir "daily-deen-upload-key.jks"
$keyAlias = "daily-deen-upload"

if (Test-Path $propertiesPath) {
    throw "android/key.properties already exists. Keep using that file for Play Store updates."
}

if (Test-Path $keystorePath) {
    throw "android/daily-deen-upload-key.jks already exists. Move it or create key.properties for it manually."
}

$keytool = (Get-Command keytool -ErrorAction SilentlyContinue).Source
if (-not $keytool) {
    $studioJdks = Get-ChildItem "$env:ProgramFiles\Android\Android Studio\jbr\bin\keytool.exe" -ErrorAction SilentlyContinue
    if ($studioJdks) {
        $keytool = $studioJdks[0].FullName
    }
}

if (-not $keytool) {
    throw "keytool was not found. Install Android Studio or a JDK, then run this again."
}

function New-Secret {
    $bytes = New-Object byte[] 24
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $rng.GetBytes($bytes)
    } finally {
        $rng.Dispose()
    }
    return [Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "A").Replace("/", "B")
}

$storePassword = New-Secret
$keyPassword = New-Secret

& $keytool `
    -genkeypair `
    -v `
    -keystore $keystorePath `
    -storetype JKS `
    -alias $keyAlias `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass $storePassword `
    -keypass $keyPassword `
    -dname "CN=Daily Deen, OU=Daily Deen, O=Daily Deen, L=Sydney, ST=NSW, C=AU"

@"
storeFile=daily-deen-upload-key.jks
storePassword=$storePassword
keyAlias=$keyAlias
keyPassword=$keyPassword
"@ | Set-Content -Path $propertiesPath -Encoding ASCII

Write-Host "Created Android upload key:"
Write-Host "  $keystorePath"
Write-Host "Created local signing config:"
Write-Host "  $propertiesPath"
Write-Host ""
Write-Host "Keep both files safe. You need this upload key for future Play Store updates."
