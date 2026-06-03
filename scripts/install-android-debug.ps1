$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$apkPath = Join-Path $repoRoot "android\app\build\outputs\apk\debug\app-debug.apk"
$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$adb = Join-Path $sdkRoot "platform-tools\adb.exe"
$tempApk = Join-Path $env:TEMP "daily-deen-debug.apk"

if (!(Test-Path $adb)) {
    throw "ADB was not found at $adb. Install Android SDK Platform Tools or set ANDROID_HOME."
}

if (!(Test-Path $apkPath)) {
    & (Join-Path $PSScriptRoot "build-android-debug.ps1")
}

$devices = & $adb devices
$connectedDevice = $devices | Select-String -Pattern "\tdevice$" | Select-Object -First 1
if (!$connectedDevice) {
    throw "No authorized Android device found. Plug in the phone, enable USB debugging, and accept the authorization prompt."
}

Copy-Item -LiteralPath $apkPath -Destination $tempApk -Force

# Remove the old temporary package if it exists, so the phone does not show two Daily Deen installs.
& $adb uninstall com.dailydeen.placeholder | Out-Null

& $adb install -r $tempApk
& $adb shell monkey -p com.zubibair.dailydeen 1 | Out-Null

Write-Host "Installed and launched Daily Deen from $tempApk"
