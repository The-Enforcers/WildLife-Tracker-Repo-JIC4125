# Wildlife Tracking App

This project is a full-stack application for creating, viewing, and managing wildlife tracking posts. The frontend is built with React, and the backend uses Node.js with Express and MongoDB.

## Prerequisites

Make sure you have node.js / npm installed

## Project Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

### 2. Set Up the Frontend and Backend

Navigate to the frontend directory and install the necessary dependencies:

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 4. Set Up Environment Variables

The project requires an enviroment variable to be set up. In the backend directory, create a .env file with the following content:

```plaintext
MONGO_URI=XXXXXXX
```

Replace XXXXXX with your MongoDB connection string. To find this string, follow these steps:

1. Navigate to your Atlas project.
2. Click on "Connect" for Cluster0 (this should be visible on the project overview page).
3. Choose "Drivers" to view the connection string.
   Replace `<password>` in the string with your actual password.

### 5. Starting the Application

Starting the Backend
To start the backend server, ensure you are in the backend directory and run:

```bash
npm start
```

This will start the backend server on http://localhost:5000.

Starting the Frontend
Open a new terminal window, navigate to the frontend directory, and run:

```bash
npm start
```

This will start the React development server on http://localhost:3000.

Now you should be able to access the application by navigating to http://localhost:3000 in your web browser. The frontend will interact with the backend to create and display posts.

### Usage

Main Page: Displays a list of wildlife tracking posts.

Page Details Page: Will show all post info

Create Post Page: Click the "Create New Post" button on the main page to add a new post. After submitting the form, the new post will be displayed on the main page.
