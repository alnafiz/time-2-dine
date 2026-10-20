-- Create the Time2Dine database
CREATE DATABASE Time2DineDB;

-- Switch to the new database
USE Time2DineDB;

-- Users Table (for managing customer accounts)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Customer') DEFAULT 'Customer',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table (stores restaurant details)
CREATE TABLE Restaurants (
    RestaurantID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CuisineType VARCHAR(100) NOT NULL,
    Rating DECIMAL(2,1) DEFAULT 0.0,
    Location VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Table (stores menu items for each restaurant)
CREATE TABLE Menu (
    MenuID INT AUTO_INCREMENT PRIMARY KEY,
    RestaurantID INT,
    MenuName VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID) ON DELETE CASCADE
);

-- Orders Table (stores customer orders)
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    RestaurantID INT,
    MenuID INT,
    Quantity INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID) ON DELETE CASCADE,
    FOREIGN KEY (MenuID) REFERENCES Menu(MenuID) ON DELETE CASCADE
);



-- Sample Data Insertion (optional, for initial testing)
INSERT INTO Restaurants (Name, CuisineType, Rating, Location) 
VALUES ('Brew', 'Snacks, Beverage', 4.3, 'Dhaka, Bangladesh');

INSERT INTO Menu (RestaurantID, MenuName, Price, Description) 
VALUES (1, 'Loaded Mushroom & Chicken Omelette', 439.00, 'Prepared with fluffy egg, sauteed mushroom & chicken');

INSERT INTO Users (FullName, Email, Password, Role)
VALUES ('John Doe', 'john@example.com', 'password123', 'Customer');

INSERT INTO Orders (UserID, RestaurantID, MenuID, Quantity, Status)
VALUES (1, 1, 1, 2, 'Pending');

INSERT INTO Reviews (UserID, RestaurantID, Rating, ReviewText)
VALUES (1, 1, 5, 'Excellent food and great service!');
