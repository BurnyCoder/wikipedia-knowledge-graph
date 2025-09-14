@echo off
REM Wikipedia Knowledge Graph Desktop Application Launcher for Windows

echo ==========================================
echo Wikipedia Knowledge Graph Desktop App
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.x
    pause
    exit /b 1
)

REM Check if virtual environment exists, create if not
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
echo Checking dependencies...
pip install -q -r requirements.txt

REM Check if graph data exists
if not exist "graph-data.json" (
    echo Graph data not found. Building from Wikipedia...
    python build_graph.py
)

REM Launch desktop application
echo.
echo Launching desktop application...
echo The application will open in a new window.
echo.
python desktop_app.py

pause