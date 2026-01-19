-- Create enquiries table for customer enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enquiry_type VARCHAR(50) DEFAULT 'GENERAL',
  product_name VARCHAR(255),
  product_slug VARCHAR(255),
  product_url VARCHAR(500),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  quantity VARCHAR(100),
  subject VARCHAR(255),
  message TEXT,
  technical_specs TEXT,
  status ENUM('NEW', 'RESPONDED', 'CLOSED') DEFAULT 'NEW',
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
