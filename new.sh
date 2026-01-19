#!/bin/bash

# Database configuration
DB_NAME="ecom_lab"
DB_USER="root"
DB_PASS="samjebas"

echo "------------------------------------------"
echo "Starting Database Setup for $DB_NAME"
echo "------------------------------------------"

# Create database if not exists
mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Check if the SQL file exists
if [ -f "ecom_lab_full.sql" ]; then
    echo "Importing schema and data from ecom_lab_full.sql..."
    mysql -u$DB_USER -p$DB_PASS $DB_NAME < ecom_lab_full.sql
    if [ $? -eq 0 ]; then
        echo "Successfully imported database!"
    else
        echo "Error: Failed to import database."
        exit 1
    fi
else
    echo "Error: ecom_lab_full.sql not found!"
    exit 1
fi

echo "------------------------------------------"
echo "Setup Complete!"
echo "------------------------------------------"
