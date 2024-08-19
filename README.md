# Email Service Challenge

This project is a simple email service built with TypeScript, Express, and Prisma. It includes features such as sending emails, tracking email statistics, and user management.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- PostgresSQL

### Installing

1. Clone the repository:
    ```
    git clone https://github.com/Elias85974/email-service-challenge.git
    ```

2. Install the dependencies:
    ```
    npm install
    ```

3. Set up your database and add your database connection string to a `.env` file in the root of the project.

4. Launch the database in docker
    ```
    docker compose up -d
    ```

5. Run the database migrations (this repository already has a migration running, no need to run it):
    ```
    npx prisma migrate dev
    ```

6. Start the server:
    ```
    npm start
    ```

## Running the tests

Run the automated tests using the following command (docker must be running first):
   ```
   npm test
   ```
