-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema online_store
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema online_store
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `online_store` DEFAULT CHARACTER SET utf8mb3 ;
USE `online_store` ;

-- -----------------------------------------------------
-- Table `online_store`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `online_store`.`products` (
  `idproducts` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NULL DEFAULT NULL,
  `category` VARCHAR(100) NULL DEFAULT NULL,
  `stock` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idproducts`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `online_store`.`cart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `online_store`.`cart` (
  `idcart` INT NOT NULL AUTO_INCREMENT,
  `quantity` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idcart`),
  INDEX `+_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_cart_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `online_store`.`products` (`idproducts`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
