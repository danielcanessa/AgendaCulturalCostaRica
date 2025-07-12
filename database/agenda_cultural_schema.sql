CREATE SCHEMA IF NOT EXISTS `agenda_cultural_db` DEFAULT CHARACTER SET utf8 ;
USE `agenda_cultural_db` ;

-- MySQL Workbench Forward Engineering (versión ajustada)

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema agenda_cultural_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `agenda_cultural_db` DEFAULT CHARACTER SET utf8 ;
USE `agenda_cultural_db` ;

-- -----------------------------------------------------
-- Table `Currencies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Currencies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `UserRoles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `UserRoles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Organization`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Organization` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `email` VARCHAR(30) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `bio` TEXT NULL,
  `is_event_organizer` TINYINT NOT NULL DEFAULT 0,
  `role_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `organization_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Users_UserRoles1_idx` (`role_id` ASC),
  INDEX `fk_Users_Organization1_idx` (`organization_id` ASC),
  CONSTRAINT `fk_Users_UserRoles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `UserRoles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_Organization1`
    FOREIGN KEY (`organization_id`)
    REFERENCES `Organization` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `start_datetime` DATETIME NOT NULL,
  `end_datetime` DATETIME NULL,
  `price` DECIMAL(10,2) NULL,
  `currency_id` INT NOT NULL,
  `ticket_link` VARCHAR(255) NULL,
  `contact_email` VARCHAR(100) NULL,
  `contact_phone` VARCHAR(30) NULL,
  `address` VARCHAR(255) NOT NULL,
  `map_location` VARCHAR(255) NULL,
  `event_banner_url` VARCHAR(255) NULL,
  `created_by` INT NOT NULL,
  `is_event_approved` TINYINT NOT NULL,
  `last_request_change_reason` VARCHAR(300) NULL,
  `delete_reason` VARCHAR(300) NULL,
  `is_event_active` TINYINT NOT NULL,
  `approved_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Events_Currencies1_idx` (`currency_id` ASC),
  INDEX `fk_Events_Users1_idx` (`created_by` ASC),
  INDEX `fk_Events_Users3_idx` (`approved_by` ASC),
  INDEX `fk_Events_Categories1_idx` (`category_id` ASC),
  CONSTRAINT `fk_Events_Currencies1`
    FOREIGN KEY (`currency_id`)
    REFERENCES `Currencies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Events_Users1`
    FOREIGN KEY (`created_by`)
    REFERENCES `Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Events_Users3`
    FOREIGN KEY (`approved_by`)
    REFERENCES `Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Events_Categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `Categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `UserEvents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `UserEvents` (
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`event_id`, `user_id`),
  INDEX `fk_Favorite_Event1_idx` (`event_id` ASC),
  INDEX `fk_UserEvents_Users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_id`
    FOREIGN KEY (`event_id`)
    REFERENCES `Events` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserEvents_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `AccessibilityFeatures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AccessibilityFeatures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `description` VARCHAR(500) NULL,
  `image_url` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `EventsHasAccessibilityFeatures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `EventsHasAccessibilityFeatures` (
  `event_id` INT NOT NULL,
  `accessibility_feature_id` INT NOT NULL,
  PRIMARY KEY (`event_id`, `accessibility_feature_id`),
  INDEX `fk_Events_has_AccessibilityFeatures_AccessibilityFeatures1_idx` (`accessibility_feature_id` ASC),
  INDEX `fk_Events_has_AccessibilityFeatures_Events1_idx` (`event_id` ASC),
  CONSTRAINT `fk_events_id`
    FOREIGN KEY (`event_id`)
    REFERENCES `Events` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_accesibility_features_id`
    FOREIGN KEY (`accessibility_feature_id`)
    REFERENCES `AccessibilityFeatures` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NULL,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `rating` TINYINT NULL CHECK (rating BETWEEN 1 AND 5),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_Comments_Users1_idx` (`user_id` ASC),
  INDEX `fk_Comments_Events1_idx` (`event_id` ASC),
  CONSTRAINT `fk_Comments_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comments_Events1`
    FOREIGN KEY (`event_id`)
    REFERENCES `Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;