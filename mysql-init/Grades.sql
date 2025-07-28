-- Adminer 4.8.1 MySQL 5.5.5-10.8.3-MariaDB-1:10.8.3+maria~jammy dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Course`;
CREATE TABLE `Course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semesterId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Course_name_key` (`name`),
  KEY `Course_semesterId_fkey` (`semesterId`),
  CONSTRAINT `Course_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `Semester` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Examination`;
CREATE TABLE `Examination` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Examination_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Grade`;
CREATE TABLE `Grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `examinationId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Grade_userId_fkey` (`userId`),
  KEY `Grade_courseId_fkey` (`courseId`),
  KEY `Grade_examinationId_fkey` (`examinationId`),
  CONSTRAINT `Grade_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Grade_examinationId_fkey` FOREIGN KEY (`examinationId`) REFERENCES `Examination` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Grade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Semester`;
CREATE TABLE `Semester` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Semester_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2025-07-22 13:51:28
