@echo off
REM Notes App Setup Script for Windows

echo.
echo ============================================
echo   Django Notes App - Setup Script
echo ============================================
echo.

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo [1] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2] Creating MySQL database...
echo Please ensure MySQL is running and execute the following SQL commands:
echo.
echo CREATE DATABASE notes_db;
echo CREATE USER 'root'@'localhost' IDENTIFIED BY '';
echo GRANT ALL PRIVILEGES ON notes_db.* TO 'root'@'localhost';
echo FLUSH PRIVILEGES;
echo.
echo Press ENTER after creating the database in MySQL...
pause

echo.
echo [3] Running database migrations...
cd notesapp
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Migration failed
    echo Check your MySQL configuration and try again
    pause
    exit /b 1
)

echo.
echo [4] Creating superuser for admin panel...
python manage.py createsuperuser

echo.
echo [5] Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the development server, run:
echo   cd d:\mini_project\notes_app\notesapp
echo   python manage.py runserver
echo.
echo The app will be available at: http://localhost:8000/
echo Admin panel: http://localhost:8000/admin/
echo.
pause
