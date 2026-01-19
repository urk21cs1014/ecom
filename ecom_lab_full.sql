-- E-commerce Project: Full Database Setup Script
-- Database: ecom_lab

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;

CREATE DATABASE IF NOT EXISTS `ecom_lab` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecom_lab`;

-- ------------------------------------------------------
-- Table structure for table `categories`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES 
(1,'Industrial Pipes','2026-01-11 10:21:45','2026-01-11 10:21:45'),
(2,'Specialty Fittings','2026-01-11 10:21:57','2026-01-11 10:21:57');

-- ------------------------------------------------------
-- Table structure for table `materials`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `materials`;
CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `grades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`grades`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `materials` (`id`, `name`, `grades`, `created_at`, `updated_at`) VALUES 
(1,'Stainless Steel','[\"ASTM A403 WP316/316L, ASTM A403 SA / A 774 WP-S, WP-W, WP-WX 304/304L, ASTM A182 F316L, 304L\"]','2026-01-10 04:02:40','2026-01-10 04:02:40'),
(2,'Duplex & Super Duplex Steel','[\"ASTM A815, ASME SA 815 UNS NO S31803, S32205. UNS S32750\"]','2026-01-10 04:02:57','2026-01-10 04:02:57'),
(3,'Carbon Steel','[\"ASTM A234, ASME SA234 WPB , WPBW, WPHY 42, WPHY 46\"]','2026-01-10 04:03:15','2026-01-10 04:03:15'),
(4,'Low Temperature Carbon Steel','[\"ASTM A420 WPL3, A420 WPL6\"]','2026-01-10 04:03:36','2026-01-10 04:03:36'),
(5,'Alloy Steel','[\"ASTM / ASME A/SA 234 Gr. WP 1, WP 5, WP 9\"]','2026-01-10 04:03:49','2026-01-10 04:03:49'),
(6,'Nickel Alloy','[\"Nickel 200, Monel 400, Inconel 800, Inconel 625, Hastelloy C 276\"]','2026-01-10 04:04:15','2026-01-10 04:04:15');

-- ------------------------------------------------------
-- Table structure for table `products`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `full_description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `stock_status` enum('IN_STOCK','OUT_OF_STOCK') DEFAULT 'IN_STOCK',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image1_url` varchar(500) DEFAULT NULL,
  `image2_url` varchar(500) DEFAULT NULL,
  `image3_url` varchar(500) DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `twitter_title` varchar(255) DEFAULT NULL,
  `twitter_description` text DEFAULT NULL,
  `facebook_title` varchar(255) DEFAULT NULL,
  `facebook_description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_material` (`material_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `title`, `slug`, `material_id`, `category_id`, `short_description`, `image1_url`, `stock_status`) VALUES 
(1,'Premium Industrial Pipe','premium-industrial-pipe',1,1,'High-grade stainless steel pipe for industrial applications.','/uploads/admin/default-pipe.webp','IN_STOCK'),
(2,'Carbon Steel Fitting','carbon-steel-fitting',3,2,'Durable carbon steel fitting for high-pressure systems.','/uploads/admin/default-fitting.webp','IN_STOCK');

-- ------------------------------------------------------
-- Table structure for table `product_pricing`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_pricing`;
CREATE TABLE `product_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `size` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pricing` (`product_id`,`material_id`,`grade`,`size`),
  KEY `idx_product` (`product_id`),
  KEY `idx_material` (`material_id`),
  CONSTRAINT `product_pricing_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_pricing_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_pricing` (`product_id`, `material_id`, `grade`, `size`, `price`) VALUES 
(1, 1, 'ASTM A403 WP316', '1/2\" to 24\"', 450.00),
(2, 3, 'ASTM A234 WPB', '1\" to 12\"', 120.00);

-- ------------------------------------------------------
-- Table structure for table `enquiries`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enquiry_type` varchar(50) DEFAULT 'GENERAL',
  `product_name` varchar(255) DEFAULT NULL,
  `product_slug` varchar(255) DEFAULT NULL,
  `product_url` varchar(500) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `technical_specs` text DEFAULT NULL,
  `status` enum('NEW','RESPONDED','CLOSED') DEFAULT 'NEW',
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table structure for table `contact_messages`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_NOTES=@OLD_SQL_NOTES;
