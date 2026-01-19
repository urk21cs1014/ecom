# E-commerce Database Setup Guide

**Project:** Lab 001 - E-commerce Platform  
**Database Name:** `ecom_lab`  
**Database Type:** MySQL/MariaDB  
**Setup Date:** January 9, 2026  
**Database Version:** 10.4.28-MariaDB

---

## 📋 Table of Contents
1. [Quick Setup Instructions](#quick-setup-instructions)
2. [Database Schema](#database-schema)
3. [Table Structures](#table-structures)
4. [Relationships & Foreign Keys](#relationships--foreign-keys)
5. [Environment Configuration](#environment-configuration)
6. [Verification Steps](#verification-steps)

---

## 🚀 Quick Setup Instructions

### Prerequisites
- MySQL/MariaDB server installed and running
- Database credentials (see below)
- Access to project backend directory

### Database Credentials
```
Username: root
Password: samjebas
Host: localhost
Port: 3306
Database: ecom_lab
```

### Step-by-Step Setup

#### 1. Create the Database
```bash
mysql -u root -psamjebas -e "CREATE DATABASE IF NOT EXISTS ecom_lab;"
```

#### 2. Run Migration Script
Navigate to the backend directory and execute:
```bash
cd /Users/samjebas/Desktop/ecom/Lab\ 001/packages/backend
mysql -u root -psamjebas ecom_lab < lib/migrations/create_materials_products.sql
```

#### 3. Verify Tables Created
```bash
mysql -u root -psamjebas ecom_lab -e "SHOW TABLES;"
```

Expected output:
```
+----------------------------+
| Tables_in_ecom_lab |
+----------------------------+
| materials                  |
| product_pricing            |
| products                   |
+----------------------------+
```

---

## 📊 Database Schema

### Overview
The database consists of **3 main tables**:

1. **materials** - Stores material types and their grades
2. **products** - Stores product catalog information
3. **product_pricing** - Stores pricing based on material, grade, and size combinations

### Entity Relationship Diagram

```
┌─────────────────┐
│   materials     │
│─────────────────│
│ id (PK)         │
│ name (UNIQUE)   │
│ grades (JSON)   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴─────────────────────────┐
    │                              │
┌───▼──────────────┐     ┌─────────▼──────────┐
│   products       │     │  product_pricing   │
│──────────────────│     │────────────────────│
│ id (PK)          │     │ id (PK)            │
│ title            │     │ product_id (FK)    │
│ slug (UNIQUE)    │     │ material_id (FK)   │
│ material_id (FK) │     │ grade              │
│ category         │     │ size               │
│ sku              │     │ price              │
│ descriptions...  │     │ created_at         │
│ stock_status     │     │ updated_at         │
│ created_at       │     └────────────────────┘
│ updated_at       │
└──────────────────┘
         │
         │ 1:N
         │
         └──────────────┘
```

---

## 🗃️ Table Structures

### 1. `materials` Table

**Purpose:** Stores material types (e.g., steel, aluminum) and their available grades

| Field      | Type         | Null | Key | Default             | Extra                         |
|------------|--------------|------|-----|---------------------|-------------------------------|
| id         | int(11)      | NO   | PRI | NULL                | auto_increment                |
| name       | varchar(255) | NO   | UNI | NULL                |                               |
| grades     | longtext     | NO   |     | NULL                | JSON format                   |
| created_at | timestamp    | NO   |     | current_timestamp() |                               |
| updated_at | timestamp    | NO   |     | current_timestamp() | on update current_timestamp() |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `name`

**Example Data:**
```json
{
  "name": "Stainless Steel",
  "grades": ["304", "316", "316L", "410", "430"]
}
```

---

### 2. `products` Table

**Purpose:** Stores comprehensive product catalog information

| Field             | Type                            | Null | Key | Default             | Extra                         |
|-------------------|---------------------------------|------|-----|---------------------|-------------------------------|
| id                | int(11)                         | NO   | PRI | NULL                | auto_increment                |
| title             | varchar(255)                    | NO   |     | NULL                |                               |
| slug              | varchar(255)                    | NO   | UNI | NULL                |                               |
| material_id       | int(11)                         | YES  | MUL | NULL                | FK to materials               |
| category          | varchar(100)                    | YES  |     | NULL                |                               |
| sku               | varchar(100)                    | YES  |     | NULL                |                               |
| short_description | text                            | YES  |     | NULL                |                               |
| full_description  | text                            | YES  |     | NULL                |                               |
| specifications    | text                            | YES  |     | NULL                |                               |
| features          | text                            | YES  |     | NULL                |                               |
| applications      | text                            | YES  |     | NULL                |                               |
| image_url         | varchar(500)                    | YES  |     | NULL                |                               |
| stock_status      | enum('IN_STOCK','OUT_OF_STOCK') | YES  |     | IN_STOCK            |                               |
| created_at        | timestamp                       | NO   |     | current_timestamp() |                               |
| updated_at        | timestamp                       | NO   |     | current_timestamp() | on update current_timestamp() |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `slug`
- INDEX: `idx_slug` on `slug`
- INDEX: `idx_material` on `material_id`

**Features:**
- SEO-friendly slugs for URL routing
- Multiple description fields for different use cases
- Stock status tracking
- Auto-updating timestamps

---

### 3. `product_pricing` Table

**Purpose:** Stores pricing variations based on material, grade, and size combinations

| Field       | Type          | Null | Key | Default             | Extra                         |
|-------------|---------------|------|-----|---------------------|-------------------------------|
| id          | int(11)       | NO   | PRI | NULL                | auto_increment                |
| product_id  | int(11)       | NO   | MUL | NULL                | FK to products                |
| material_id | int(11)       | NO   | MUL | NULL                | FK to materials               |
| grade       | varchar(255)  | NO   |     | NULL                |                               |
| size        | varchar(100)  | NO   |     | NULL                |                               |
| price       | decimal(10,2) | NO   |     | NULL                |                               |
| created_at  | timestamp     | NO   |     | current_timestamp() |                               |
| updated_at  | timestamp     | NO   |     | current_timestamp() | on update current_timestamp() |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `unique_pricing` on (`product_id`, `material_id`, `grade`, `size`)
- INDEX: `idx_product` on `product_id`
- INDEX: `idx_material` on `material_id`

**Features:**
- Prevents duplicate pricing entries with unique constraint
- Supports complex pricing models (material + grade + size)
- Decimal precision for accurate pricing (10,2)

---

## 🔗 Relationships & Foreign Keys

### Foreign Key Constraints

| Table           | Column      | References        | On Delete Action |
|-----------------|-------------|-------------------|------------------|
| products        | material_id | materials(id)     | SET NULL         |
| product_pricing | product_id  | products(id)      | CASCADE          |
| product_pricing | material_id | materials(id)     | CASCADE          |

### Relationship Descriptions

1. **materials → products** (One-to-Many)
   - One material can be associated with multiple products
   - If a material is deleted, associated products' `material_id` is set to NULL

2. **products → product_pricing** (One-to-Many)
   - One product can have multiple pricing entries (different materials, grades, sizes)
   - If a product is deleted, all its pricing entries are deleted (CASCADE)

3. **materials → product_pricing** (One-to-Many)
   - One material can have multiple pricing entries across different products
   - If a material is deleted, all its pricing entries are deleted (CASCADE)

---

## ⚙️ Environment Configuration

### Update `.env.local` File

Create or update the `.env.local` file in the backend directory:

**Location:** `/Users/samjebas/Desktop/ecom/Lab 001/packages/backend/.env.local`

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=samjebas
DB_NAME=ecom_lab
DB_PORT=3306

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Node Environment
NODE_ENV=development
```

> **⚠️ Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## ✅ Verification Steps

### 1. Check Database Connection
```bash
mysql -u root -psamjebas ecom_lab -e "SELECT 'Database connection successful!' AS status;"
```

### 2. Verify All Tables Exist
```bash
mysql -u root -psamjebas ecom_lab -e "SHOW TABLES;"
```

Expected: 3 tables (materials, product_pricing, products)

### 3. Verify Table Structures
```bash
# Check materials table
mysql -u root -psamjebas ecom_lab -e "DESCRIBE materials;"

# Check products table
mysql -u root -psamjebas ecom_lab -e "DESCRIBE products;"

# Check product_pricing table
mysql -u root -psamjebas ecom_lab -e "DESCRIBE product_pricing;"
```

### 4. Verify Foreign Key Relationships
```bash
mysql -u root -psamjebas ecom_lab -e "SELECT 
    TABLE_NAME, 
    CONSTRAINT_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'ecom_lab' 
AND REFERENCED_TABLE_NAME IS NOT NULL;"
```

Expected: 3 foreign key relationships

### 5. Test Application Connection

From the backend directory, you can test the connection using the Node.js application:

```bash
cd /Users/samjebas/Desktop/ecom/Lab\ 001/packages/backend
npm run dev
```

The application should connect to the database without errors.

---

## 📝 Additional Notes

### Character Set & Collation
- **Engine:** InnoDB (supports transactions and foreign keys)
- **Character Set:** utf8mb4 (supports full Unicode including emojis)
- **Collation:** utf8mb4_unicode_ci (case-insensitive Unicode)

### Timestamps
- All tables include `created_at` and `updated_at` timestamps
- `updated_at` automatically updates on row modification
- Default timezone follows MySQL server settings

### JSON Support
- The `materials.grades` field uses JSON format
- Allows flexible storage of material grade arrays
- Can be queried using MySQL JSON functions

---

## 🔒 Security Recommendations

> **⚠️ Production Deployment:**
> 1. Change default passwords immediately
> 2. Create a dedicated database user with limited privileges
> 3. Use environment variables for all credentials
> 4. Enable SSL/TLS for database connections
> 5. Regular backups and disaster recovery plan
> 6. Implement proper access control and auditing

### Creating a Dedicated Database User (Recommended)

```sql
-- Create new user
CREATE USER 'ecom_app'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ecom_lab.* TO 'ecom_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** "Access denied for user 'root'@'localhost'"
- **Solution:** Verify password is correct, check MySQL/MariaDB is running

**Issue:** "Unknown database 'ecom_lab'"
- **Solution:** Run the database creation command again

**Issue:** "Table already exists" error
- **Solution:** The migration script uses `IF NOT EXISTS`, this shouldn't occur. If it does, check for manual table modifications.

### Migration Files Location
```
/Users/samjebas/Desktop/ecom/Lab 001/packages/backend/lib/migrations/
└── create_materials_products.sql
```

---

## 📚 References

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MariaDB Documentation](https://mariadb.com/kb/en/)
- Project Backend: `/Users/samjebas/Desktop/ecom/Lab 001/packages/backend`
- Database Config: `lib/db.ts`

---

**Document Version:** 1.0  
**Last Updated:** January 9, 2026  
**Maintained By:** Development Team
