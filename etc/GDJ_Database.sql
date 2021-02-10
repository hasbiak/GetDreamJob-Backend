-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.11-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for gdj_database
CREATE DATABASE IF NOT EXISTS `gdj_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `gdj_database`;

-- Dumping structure for table gdj_database.chat
CREATE TABLE IF NOT EXISTS `chat` (
  `chatId` int(10) NOT NULL AUTO_INCREMENT,
  `roomIdUniq` int(10) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sender` int(5) DEFAULT NULL,
  `receiver` int(5) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`chatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.chat: ~0 rows (approximately)
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;

-- Dumping structure for table gdj_database.experiance_pekerja
CREATE TABLE IF NOT EXISTS `experiance_pekerja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pekerja` int(11) DEFAULT NULL,
  `posisi` varchar(100) DEFAULT NULL,
  `at_company` varchar(50) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.experiance_pekerja: ~0 rows (approximately)
/*!40000 ALTER TABLE `experiance_pekerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiance_pekerja` ENABLE KEYS */;

-- Dumping structure for table gdj_database.hired_jobs
CREATE TABLE IF NOT EXISTS `hired_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_recruiter` int(11) DEFAULT NULL,
  `id_pekerja` int(11) DEFAULT NULL,
  `files` varchar(150) DEFAULT NULL,
  `read_status` enum('ON','OFF') NOT NULL DEFAULT 'OFF',
  `jobs_needed` varchar(50) DEFAULT NULL,
  `desc_jobs` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.hired_jobs: ~0 rows (approximately)
/*!40000 ALTER TABLE `hired_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `hired_jobs` ENABLE KEYS */;

-- Dumping structure for table gdj_database.portofolio
CREATE TABLE IF NOT EXISTS `portofolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pekerja` int(11) DEFAULT NULL,
  `application_name` varchar(50) DEFAULT NULL,
  `repo_link` varchar(50) DEFAULT NULL,
  `type_portofolio` varchar(30) DEFAULT NULL,
  `image_portofolio` varchar(150) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.portofolio: ~0 rows (approximately)
/*!40000 ALTER TABLE `portofolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `portofolio` ENABLE KEYS */;

-- Dumping structure for table gdj_database.profile_pekerja
CREATE TABLE IF NOT EXISTS `profile_pekerja` (
  `id_pekerja` int(11) NOT NULL,
  `fullname_pekerja` varchar(100) DEFAULT NULL,
  `job_desk` varchar(100) DEFAULT NULL,
  `city_pekerja` varchar(50) DEFAULT NULL,
  `job_require` varchar(50) DEFAULT NULL,
  `status_jobs` enum('ON','OFF') NOT NULL DEFAULT 'OFF',
  `work_place` varchar(50) DEFAULT NULL,
  `desc_pekerja` varchar(150) DEFAULT NULL,
  `image_pekerja` varchar(150) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `linked` varchar(100) DEFAULT NULL,
  `github` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_pekerja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.profile_pekerja: ~0 rows (approximately)
/*!40000 ALTER TABLE `profile_pekerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_pekerja` ENABLE KEYS */;

-- Dumping structure for table gdj_database.profile_recruiter
CREATE TABLE IF NOT EXISTS `profile_recruiter` (
  `id_recruiter` int(11) NOT NULL,
  `city_recruiter` varchar(50) DEFAULT NULL,
  `desc_recruiter` varchar(150) DEFAULT NULL,
  `image_recruiter` varchar(150) DEFAULT NULL,
  `social_media` varchar(100) DEFAULT NULL,
  `linked_in` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_recruiter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.profile_recruiter: ~0 rows (approximately)
/*!40000 ALTER TABLE `profile_recruiter` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_recruiter` ENABLE KEYS */;

-- Dumping structure for table gdj_database.roomchat
CREATE TABLE IF NOT EXISTS `roomchat` (
  `roomId` int(10) NOT NULL AUTO_INCREMENT,
  `roomIdUniq` int(10) DEFAULT NULL,
  `sender` int(10) DEFAULT NULL,
  `receiver` int(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`roomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.roomchat: ~0 rows (approximately)
/*!40000 ALTER TABLE `roomchat` DISABLE KEYS */;
/*!40000 ALTER TABLE `roomchat` ENABLE KEYS */;

-- Dumping structure for table gdj_database.skills_pekerja
CREATE TABLE IF NOT EXISTS `skills_pekerja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pekerja` int(11) DEFAULT NULL,
  `skill_name` varchar(100) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.skills_pekerja: ~0 rows (approximately)
/*!40000 ALTER TABLE `skills_pekerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `skills_pekerja` ENABLE KEYS */;

-- Dumping structure for table gdj_database.user_account
CREATE TABLE IF NOT EXISTS `user_account` (
  `id_user` int(15) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email_user` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `token_confirmEmail` varchar(100) DEFAULT NULL,
  `token_forgotPassword` varchar(100) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `roles` tinyint(4) NOT NULL DEFAULT 0,
  `status_user` enum('ON','OFF') NOT NULL DEFAULT 'OFF',
  `created_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table gdj_database.user_account: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
