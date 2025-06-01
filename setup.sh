#!/bin/bash

echo "Setting up Django backend environment"

# Check for MySQL root password
if [ -z "$1" ]; then
  echo "Usage: $0 <mysql_root_password>"
  exit 1
fi

MYSQL_ROOT_PASSWORD="$1"

# Step 1: Recreate the database
echo "📦 Recreating MySQL database"
mysql -u root -p$MYSQL_ROOT_PASSWORD < database/schema.sql

if [ $? -ne 0 ]; then
  echo "Failed to run schema.sql. Check MySQL credentials or permissions."
  exit 1
fi

# Step 2: Create virtual environment if needed
if [ ! -d "backend/env" ]; then
  echo "Creating virtual environment"
  python3 -m venv backend/env
fi

# Step 3: Activate virtual environment
echo "Activating environment and installing dependencies"
source backend/env/bin/activate

# Step 4: Install dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt

# Step 5: Apply Django migrations
cd backend
echo "Applying migrations"
python manage.py migrate

# Step 6: Load initial data
echo "Loading sample data"
python manage.py runscript load_sample_data

# Step 7: Start the development server
echo "Starting Django development server"
python manage.py runserver