$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidDir = Join-Path $root "android"
$propertiesPath = Join-Path $androidDir "key.properties"
$bundlePath = Join-Path $androidDir "app\build\outputs\bundle\release\app-release.aab"
[string[]]$jdkCandidates = @(
    "$env:ProgramFiles\Eclipse Adoptium\jdk-21.0.11.10-hotspot",
    "$env:ProgramFiles\Android\Android Studio\jbr",
    "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
    $env:JAVA_HOME
) | Where-Object { $_ -and (Test-Path (Join-Path $_ "bin\java.exe")) }

if (-not $jdkCandidates) {
    throw "Java 21+ was not found. Install Android Studio's current JDK or Temurin JDK 21, then run this again."
}

$env:JAVA_HOME = $jdkCandidates[0]
$javaBin = Join-Path $env:JAVA_HOME "bin"
$env:PATH = "$javaBin;$env:PATH"

if (-not (Test-Path $propertiesPath)) {
    throw "Missing android/key.properties. Run npm run create:android:upload-key first."
}

Push-Location $androidDir
try {
    & .\gradlew.bat bundleRelease
} finally {
    Pop-Location
}

if (-not (Test-Path $bundlePath)) {
    throw "Release bundle was not created at $bundlePath"
}

Write-Host "Play Store bundle ready:"
Write-Host "  $bundlePath"
