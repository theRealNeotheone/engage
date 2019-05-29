-- Creates the "engageDB" database --
CREATE DATABASE engageDB;

-- Make it so all of the following code will affect engageDB --
USE engageDB;

CREATE TABLE category (
  -- Create a numeric column called "id" which automatically increments and cannot be null --
  id INTEGER NOT NULL AUTO_INCREMENT,
  -- Create a string column called "name" which cannot be null --
  name VARCHAR(45) NOT NULL,
  parent_category VARCHAR(45) NOT NULL,
  child_Category VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT,
  UPC INTEGER(10),
  name VARCHAR(45) NOT NULL,
  price DECIMAL(65,2) NULL,
  category VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);