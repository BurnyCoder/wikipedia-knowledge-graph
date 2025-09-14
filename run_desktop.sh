#!/bin/bash

# Wikipedia Knowledge Graph Desktop Application Launcher

echo "=========================================="
echo "Wikipedia Knowledge Graph Desktop App"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.x"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD=$(command -v python3 || command -v python)

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || {
    echo "Warning: Could not activate virtual environment"
}

# Install dependencies if needed
echo "Checking dependencies..."
pip install -q -r requirements.txt

# Check if graph data exists
if [ ! -f "graph-data.json" ]; then
    echo "Graph data not found. Building from Wikipedia..."
    $PYTHON_CMD build_graph.py
fi

# Launch desktop application
echo ""
echo "Launching desktop application..."
echo "The application will open in a new window."
echo ""
$PYTHON_CMD desktop_app.py