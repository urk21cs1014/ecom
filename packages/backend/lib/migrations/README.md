# Database Migration Instructions

## Running the Migration

This migration will:
1. Drop the old `products` table
2. Create new tables:
   - `materials` - Stores material types and their grades
   - `products` - Updated product structure with material reference
   - `product_pricing` - Stores pricing based on material, grade, and size

## Steps to Run Migration

1. **Make sure you have your database credentials in `.env.local`:**
   ```env
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database
   DB_PORT=3306
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   cd packages/backend
   npm install mysql2 dotenv
   ```

3. **Run the migration:**
   ```bash
   cd packages/backend
   node lib/migrations/run-migration.js
   ```

   Or if you prefer to run the SQL directly:
   ```bash
   mysql -u your_user -p your_database < lib/migrations/create_materials_products.sql
   ```

## Important Notes

⚠️ **WARNING:** This migration will DELETE all existing product data. Make sure to backup your database before running this migration if you have important data.

## New Database Structure

### Materials Table
- `id` - Primary key
- `name` - Material name (e.g., "Stainless Steel", "Carbon Steel")
- `grades` - JSON array of available grades (e.g., ["ASTM A403 WP316", "DIN 1.4301"])

### Products Table
- `id` - Primary key
- `title` - Product title (changed from `name`)
- `slug` - URL-friendly identifier
- `material_id` - Foreign key to materials table
- `category`, `sku`, `short_description`, `full_description`, etc.
- `stock_status` - IN_STOCK or OUT_OF_STOCK

### Product Pricing Table
- `id` - Primary key
- `product_id` - Foreign key to products
- `material_id` - Foreign key to materials
- `grade` - Material grade (e.g., "ASTM A403 WP316")
- `size` - Product size (e.g., "1/2\"NB", "2\"NB")
- `price` - Price in USD

## After Migration

1. Go to `/admin/materials` and add your materials with their grades
2. Go to `/admin/products` and create products, selecting materials and adding pricing entries
