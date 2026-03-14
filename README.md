# Laundry-Sales-and-Inventory-System

*An offline desktop app for managing sales and inventory. Built with [Electron](https://github.com/atom/electron), React, Typescript and [Realm](https://github.com/realm) as offline database.*

## Features

- Manage Laundry
- View, create, update and delete products.
- Purchase products through cash register.
- Can use barcode scanner for quick item search.
- Manage Gcash(E-wallet) transactions.
- Manage sales.
- Can add users as 'Admin', 'Manager' or 'Staff'.
- Role base restrictions.
- Manage expenses.
- View user activities.
- View sales graph reports.

## How To Use

To clone and run this repository you'll [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer. From your command line:

``` bash
# Clone this repository
git clone https://github.com/mikeale03/Sales-and-Inventory-System.git
```
The app will look for 'realm' folder to store database files. Create an empty 'realm' folder outside of the cloned 'Sales-and-Inventory-System' folder. After that, open the 'Sales-and-Inventory-System' folder with your code editor.

![for-github](https://github.com/user-attachments/assets/301ccd12-4daa-4571-81ff-9e88e55a13f9)

``` bash
# Go into the repository
cd Sales-and-Inventory-System
# Install dependencies and run the app
npm install && npm start
```

To pack into an app:

``` shell
npm run package
```
