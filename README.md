# Payment Gateway

Hello! This is the Payment Gateway code repository. The purpose of this README file is to guide you through the different parts of it.

## Languages & Frameworks
We primarily write in JavaScript and ReactJS. Our backend is uses NodeJS, Express & PostgresSQL.

## Backend Application Entry Point

Our backend application's main entry point is found in [`index.js`](index.js).

## `.env` file

The [.env](.env) file is a plain text configuration file that contains environment variables. These variables are used to define various settings and parameters required for the proper functioning of the Payment Gateway application. By modifying the values in the .env file, you can adapt the application to your specific needs.

## Database Specs & Integration

We uses a relational database (Postgres). Everything related to our database is found inside the [database](database) folder.

### Frontend Linting

The [`payment_gateway_frontend`](payment_gateway_frontend) project actually users eslint.

## Prerequisites

To run this application, you will need:

- [NodeJS](https://nodejs.org/) version 18.12.1.
- [PostgreSQL](https://www.postgresql.org/) version 12.
- [PgAdmin4](https://www.pgadmin.org/) (any version, but the latest is recommended) for managing the PostgreSQL database system.

## Setup

### Step 1: Clone the Repository
Clone the repository to your local machine using the following command::

```bash
git clone git@github.com:alized559/payment_gateway.git
```

### Step 2: Database Configuration
Use the database configuration provided in the [.env](.env) file to create the database in your PostgreSQL server using PgAdmin4. Make sure you have PostgreSQL up and running.

### Step 3: Restore the Database
Execute the SQL script to restore the database schema. You can find the SQL file at [payment_gateway_db.sql](database/payment_gateway_db.sql). This step will set up the necessary tables.

### Step 4: Install Backend Dependencies
Navigate to the root directory and install the backend dependencies using the following command:

```bash
npm install
```

### Step 5: Run the Backend Server
Start the backend server by running the following command:

```bash
npm start
```

### Step 6: Install Frontend Dependencies
Navigate to the [payment_gateway_frontend](payment_gateway_frontend) directory and install the frontend dependencies:

```bash
npm install
```

### Step 7: Run the Frontend App
Start the frontend application with the following command:

```bash
npm start
```

## Luhn Algorithm

We uses Luhn Algorithm, which is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers. The algorithm works by summing up the digits of the number, starting from the rightmost digit and moving left. If the sum is divisible by 10, then the number is considered valid. The reason for choosing this approach is its simplicity and readability while effectively checking the validity of credit card numbers according to the algorithm.
