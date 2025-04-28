
# Pokedex API 

Welcome to the Pokedex API project!
This project is built using TypeScript, Node.js, Express, MySQL, and a set of powerful tools to deliver a professional and scalable backend application.

##  🚀 Technologies Used

- Node.js with Express — for building the REST API.

- TypeScript — for strong typing and better code quality.

- MySQL (with mysql2) — for managing the Pokedex database.

- dotenv — to manage environment variables securely.

- Winston — for structured and scalable logging.

- Nodemon — for automatic server reload during development.

- bcrypt — for secure password hashing.

- JWT (JSON Web Tokens) — for user authentication and token management.

## 🛠 Features 

- Full CRUD on Pokémon entries.

- User authentication system (Sign up, Login) with secure password hashing.

- Protected routes using JWT-based authorization.

- Detailed logging of server activities and errors.

- Environment variables for sensitive data protection.

- Modular and scalable project structure (routes/controllers/models).


## 📦 Installation

1. Clone the repository:

`git clone https://github.com/antorou/api_pokedex.git`

`cd pokedex-api`

2. Install dependencies:

`npm install`

3. Configure your environment variables: Create a .env file in the root folder:

`DB_HOST=your_mysql_host`
`DB_USER=your_mysql_user`
`DB_PASSWORD=your_mysql_password`
`DB_NAME=your_database_name`
`SECRET_KEY=your_secret_key`
