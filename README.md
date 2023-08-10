# Task Manager App

The Task Manager App is a full stack web application built using React.js for the frontend, Express.js for the backend, and MongoDB as the database. It provides users with the ability to manage tasks, including logging in, signing up, adding tasks, deleting tasks, moving tasks between different states (Todo, Ongoing, Done), and automatically sending tasks to the "Expired" state when the deadline is reached.

## Features

### User Authentication:

- Users can create accounts by signing up.
  
- Users can log in using their credentials.

### Task Management:

- Users can add new tasks with a title, description, priority, and deadline.
  
- Users can delete tasks from their list.
  
- Users can move tasks between different states (Todo, Ongoing, Done).

### Automatic Task Management:

- Tasks are automatically moved to the "Expired" state when their deadline is reached.

### User Session:

- User sessions are managed to keep users logged in across sessions.
  
- Users can log out to end their session.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
  
- MongoDB Atlas account for database storage.

### Installation

- Clone the repository:
  
`git clone https://github.com/YourUsername/Task-Manager-App.git`

- Navigate to the frontend directory and install frontend dependencies:
  
`cd Task-Manager-App/frontend`

`npm install`

- Navigate to the backend directory and install backend dependencies:
  
`npm install`

### Configuration

- Create a .env file in the backend directory and add your MongoDB connection string:
  
`MONGODB_URI=your-mongodb-connection-string`

### Usage

- Start the frontend development server:
  
`cd ../frontend`

`npm start`

- Start the backend server:
  
`cd ../backend`

`node server.js`

- Access the application in your web browser at http://localhost:3000.
