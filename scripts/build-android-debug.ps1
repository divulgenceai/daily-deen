$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $repoRoot "android"
$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }

$jdkCandidates = @()
if ($env:JAVA_HOME) {
    $jdkCandidates += $env:JAVA_HOME
}
$jdkCandidates += Get-ChildItem -Path `
    (Join-Path $env:LOCALAPPDATA "Programs\Eclipse Adoptium"), `
    "$env:ProgramFiles\Java", `
    "$env:ProgramFiles\Eclipse Adoptium" `
    -Directory -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName

$jdk21 = $jdkCandidates |
    Where-Object { Test-Path (Join-Path $_ "bin\java.exe") } |
    Where-Object {
        $java = Join-Path $_ "bin\java.exe"
        $version = cmd /c "`"$java`" -version 2>&1"
        $version -match '"21\.'
    } |
    Select-Object -First 1

if (!$jdk21) {
    throw "JDK 21 was not found. Install Eclipse Temurin JDK 21, then rerun this script."
}

if (!(Test-Path (Join-Path $sdkRoot "platforms\android-36\android.jar"))) {
    throw "Android SDK platform 36 was not found at $sdkRoot. Install Android SDK Platform 36 first."
}

$env:JAVA_HOME = $jdk21
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
Remove-Item Env:\_JAVA_OPTIONS -ErrorAction SilentlyContinue

$localProperties = Join-Path $androidDir "local.properties"
$sdkProperty = ($sdkRoot -replace "\\", "/")
Set-Content -LiteralPath $localProperties -Value "sdk.dir=$sdkProperty"

Push-Location $androidDir
try {
    & .\gradlew.bat assembleDebug
}
finally {
    Pop-Location
}
