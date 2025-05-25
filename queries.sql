CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE User_Addresses (
    Address_ID SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID) ON DELETE CASCADE,
    Address_Line VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Pincode VARCHAR(10) NOT NULL
);

CREATE TABLE Restaurants (
    Restaurant_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Phone VARCHAR(15) UNIQUE
);

CREATE TABLE Menu_Items (
    Item_ID SERIAL PRIMARY KEY,
    Restaurant_ID INT REFERENCES Restaurants(Restaurant_ID) ON DELETE CASCADE,
    Item_Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Orders (
    Order_ID SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID) ON DELETE CASCADE,
    Address_ID INT REFERENCES User_Addresses(Address_ID) ON DELETE CASCADE,
    Restaurant_ID INT REFERENCES Restaurants(Restaurant_ID) ON DELETE CASCADE,
    Order_Date DATE NOT NULL,
    Total_Amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE Order_Items (
    Order_ID INT REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    Item_ID INT REFERENCES Menu_Items(Item_ID) ON DELETE CASCADE,
    Quantity INT NOT NULL,
    Price_At_Order DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (Order_ID, Item_ID)
);

CREATE TABLE Payments (
    Payment_ID SERIAL PRIMARY KEY,
    Order_ID INT REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    Payment_Method VARCHAR(50) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Payment_Status VARCHAR(50) NOT NULL,
    Payment_Date DATE NOT NULL
);

CREATE TABLE Delivery (
    Delivery_ID SERIAL PRIMARY KEY,
    Order_ID INT REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    Delivery_Status VARCHAR(50) NOT NULL,
    Delivery_Date DATE
);