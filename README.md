### Backend API for Skill Exchange Platform

This project is the backend API for a skill exchange platform, where users can connect to learn and teach skills. The backend is built using Node.js, Express.js, and MongoDB for data storage. It handles user registration, skill requests, and basic messaging functionalities.

## Features

- User Authentication: Register, login, and manage user profiles with secure password hashing.
- Skill Requests: Users can post skill requests, including options to add likes and manage media.
- Messaging: Send and receive messages between users with skill request details.
- CRUD Operations: For users

## Technologies

- Node.js: JavaScript runtime for building the backend.
- Express.js: Web framework for building the API routes.
- MongoDB & Mongoose: NoSQL database to store user data, skill - requests, and messages.
- JWT (JSON Web Tokens): Used for user authentication and session management.
- Cloudinary: For handling image uploads (profile pictures, skill request pictures).
- Bcrypt.js: To hash passwords securely before saving them in the database.

## API Endpoints

# Users

- POST /users/register: Register a new user.
- POST /users/login: Login an existing user.
- GET /users: Get all users.
- GET /users/:id: Get user details by ID.
- PUT /users/:id: Update user profile.
- DELETE /users/:id: Delete user profile.

# Skill Requests

- GET /skillrequests: Get all skill requests.
- GET /skillrequests/:id: Get skill request by ID.
- POST /skillrequests: Create a new skill request.
- PUT /skillrequests/:id: Update a skill request.
- DELETE /skillrequests/:id: Delete a skill request.
- PUT /skillrequests/like/:id: Add a like to a skill request.
- PUT /skillrequests/removeLike/:id: Remove a like from a skill request.

# Messages

- GET /messages: Get all messages.
- GET /messages/:id: Get a message by ID.
- POST /messages: Send a new message.
- DELETE /messages/:id: Delete a message.

## Seed Data

To quickly populate the database with sample users and skill requests for testing, you can use the following seed commands:

Seed users: npm run seedUsers
Seed skill requests: npm run seedSkillRequest
Seed users: npm run seedMessage

it's important to match the related field between the shemas, please use the command:

npm run injectRelatedFields

## API URL

https://project-13-backend.vercel.app/

## Website URL

https://wegrowtogether.netlify.app/
