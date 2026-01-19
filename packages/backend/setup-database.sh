#!/bin/bash
# Quick Database Setup Script for E-commerce Lab 001
# Run this script to set up the database from scratch

# Database credentials
DB_USER="root"
DB_PASS="samjebas"
DB_NAME="ecom_lab"

echo "========================================"
echo "E-commerce Database Setup Script"
echo "========================================"
echo ""

# Step 1: Create database
echo "Step 1: Creating database '$DB_NAME'..."
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "✗ Failed to create database"
    exit 1
fi

echo ""

# Step 2: Run migrations
echo "Step 2: Running migration scripts..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < lib/migrations/create_materials_products.sql

if [ $? -eq 0 ]; then
    echo "✓ Tables created successfully"
else
    echo "✗ Failed to create tables"
    exit 1
fi

echo ""

# Step 3: Verify setup
echo "Step 3: Verifying database setup..."
echo ""
echo "Tables in database:"
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SHOW TABLES;"

echo ""
echo "Foreign key relationships:"
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '$DB_NAME' AND REFERENCED_TABLE_NAME IS NOT NULL;"

echo ""
echo "========================================"
echo "✓ Database setup completed successfully!"
echo "========================================"
echo ""
echo "Database Name: $DB_NAME"
echo "Tables: materials, products, product_pricing"
echo ""
echo "Next steps:"
echo "1. Update .env.local with database credentials"
echo "2. Run 'npm run dev' to start the application"
echo ""
