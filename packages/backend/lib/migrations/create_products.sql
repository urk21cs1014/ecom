-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  material_id INT,
  category VARCHAR(100),
  sku VARCHAR(100),
  short_description TEXT,
  full_description TEXT,
  specifications TEXT,
  features TEXT,
  applications TEXT,
  image_url VARCHAR(500),
  stock_status ENUM('IN_STOCK', 'OUT_OF_STOCK') DEFAULT 'IN_STOCK',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_material (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
