# Backend API

This project is an implementation of the **Secret Server Coding Task** as specified
[**here**](https://github.com/peti2001/secret-server-task).

## Technologies Used

- **Elysia**: A web framework for building APIs.
- **Knex**: SQL query builder for Node.js.
- **PostgreSQL**: Relational database management system.
- **Bun**: Fast JavaScript runtime for running and managing the project.
- **TypeScript**: Superset of JavaScript that adds static types.

## Setup

### Prerequisites

- **PostgreSQL**: Ensure that you have PostgreSQL installed and running. Create a database for this project.

### Installation

1. **Clone the Repository**

```shell
git clone https://github.com/kodersrank/api.git
cd ./api
```

2. **Install Dependencies**

```shell
bun install
```

### Configuration

1. **Create a `.env` file**

Create a `.env` file in the root directory of the project and add the following environment variables:

```shell
APP_ORIGIN=localhost:3000|127.0.0.1:3000

DB_HOST=<host>
DB_NAME=<dbname>
DB_USER=<user>
DB_PASSWORD=<password>
```

Replace `<host>`, `<dbname>`, `<user>` and `<password>` with your PostgreSQL credentials and database name.
The default PostgreSQL port will be used (`5432`).

### Running the Project

1. **Run Migrations**

Apply the database migrations using Knex:

```shell
bunx knex migrate:latest
```

If it faces any issues loading the environment variables, run:

```shell
bunx @dotenvx/dotenvx run -- bunx knex migrate:latest
```

2. **Start the Server**

```shell
bun start
```

The API will be available at `http://localhost:3333`.

### Swagger Documentation

You may access the Swagger documentation at `http://localhost:3333/swagger`.

### Demo Instance

- You can try a live demo of the API [**here**](https://api-u1hh.onrender.com/swagger).

### Notes

- Ensure PostgreSQL is running and configured correctly.
- Modify the `.env` file with your database details.
