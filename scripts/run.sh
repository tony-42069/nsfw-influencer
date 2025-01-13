# scripts/run.sh
#!/bin/bash
# Activate virtual environment if exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start the FastAPI server
python main.py