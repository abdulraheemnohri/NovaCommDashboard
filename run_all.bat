@echo off
SETLOCAL

REM --- NovaComm++ Project Auto-Run Script ---
REM This script starts the Backend, Frontend, and Node Simulation.
REM All processes will run in the background.

REM --- IMPORTANT: Ensure all dependencies are installed before running this script ---
REM Backend: cd backend && pip install -r requirements.txt
REM Frontend: cd frontend && npm install
REM Scripts: cd scripts && pip install -r requirements.txt

REM --- Set environment variable for FastAPI SECRET_KEY ---
REM Replace 'your_super_secret_key_here' with a strong, random key.
SET NOVCOMM_SECRET_KEY=your_super_secret_key_here

REM --- Start Backend (FastAPI) ---
ECHO Starting NovaComm++ Backend...
START /B cmd /c "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend_log.txt 2>&1"
ECHO Backend started. Check backend_log.txt for output.

REM --- Start Frontend (React) ---
ECHO Starting NovaComm++ Frontend...
START /B cmd /c "cd frontend && npm start > frontend_log.txt 2>&1"
ECHO Frontend started. Check frontend_log.txt for output.

REM --- Start Node Simulation ---
ECHO Starting NovaComm++ Node Simulation...
START /B cmd /c "cd scripts && python simulate_nodes.py > simulation_log.txt 2>&1"
ECHO Node Simulation started. Check simulation_log.txt for output.

ECHO.
ECHO All components are starting in the background.
ECHO You can access the dashboard at http://localhost:3000
ECHO.
ECHO To stop all processes, you will need to manually close the command prompt windows
ECHO that opened for each process, or use Task Manager to end 'uvicorn', 'node', and 'python' processes.
ECHO.
ECHO Press any key to exit this launcher script...
PAUSE >NUL

ENDLOCAL
