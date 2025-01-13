# scripts/setup.sh
#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p logs
mkdir -p data

# Initialize configuration
cp config/personality_config.example.json config/personality_config.json
cp config/system_config.example.json config/system_config.json

echo "Setup complete!"
