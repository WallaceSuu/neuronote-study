#!/usr/bin/env bash
# exit on error
set -o errexit

# Print Python version
echo "Using Python version:"
python --version

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r ../requirements.txt

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!" 