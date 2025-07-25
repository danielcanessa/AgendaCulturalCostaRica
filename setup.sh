#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -x  # Shows commands being executed

# Free port 8000 if already in use
# PORT=8000
# PID=$(lsof -ti tcp:$PORT)
# if [ -n "$PID" ]; then
#   echo "Killing process on port $PORT (PID $PID)"
#   kill -9 $PID
# fi

echo "Setting up Django backend environment"

if [ -z "$1" ]; then
  echo "Usage: $0 <mysql_root_password>"
  exit 1
fi

MYSQL_ROOT_PASSWORD="$1"

# 1. Drop and recreate database
echo "Dropping and recreating MySQL database"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "DROP DATABASE IF EXISTS agenda_cultural_db;"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE agenda_cultural_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Setup virtual environment
if [ ! -d "backend/venv" ]; then
  echo "Creating virtual environment"
  python3 -m venv backend/venv
fi

echo "Activating environment and installing dependencies"
source backend/venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# 3. Django migrations
cd backend
echo "Applying migrations"
python manage.py makemigrations
python manage.py migrate

## Load sample data using Django management command (uncomment if needed)
## if [ -f "scripts/load_sample_data_db.py" ]; then
##   echo "Loading sample data"
##   python manage.py runscript load_sample_data_db
## fi

# 4. Start development server (before populating data)
echo "Starting Django development server"
exec python manage.py runserver
