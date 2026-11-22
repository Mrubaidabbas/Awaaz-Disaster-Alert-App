@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22.13 or newer, then reopen this file.
  echo Download it from https://nodejs.org/
  pause
  exit /b 1
)
echo Installing or checking the app packages. The first run needs internet access.
call npm install
if errorlevel 1 (
  echo Package installation failed. Check your internet connection and try again.
  pause
  exit /b 1
)
call npx expo start
pause
