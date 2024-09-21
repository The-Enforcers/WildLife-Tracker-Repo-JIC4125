# WildTrack: The Wildlife Tracker Wikipedia
This project is designed to serve as a centralized repository for information on wildlife trackers, making information that was previously either paywalled or scattered across the web in papers, blogs, and project githubs more accessible to the wildlife researcher community. It is based around the concept of user-created "animal profiles"/"posts" where researchers can independetly outline tracking equipment, methods, recommendations, etc. from their experience.

# Release Notes

## Version 0.1.0
### Features 
- **Navigation**: Home page with site navigation (animal categories, sidebar with shortcuts to results page, creating a post)
- **Post results and Viewing**: Results page that shows all created post on platform - with ability to click through to posts.
- **Post Creation**: Create post page where users can fill out post fields, submit the post, and then have it viewable on the results page.

### Bug Fixes
- N/A

### Known Issues
- Incomplete "Post" page UI
- Simplified Post creation and Post Viewing UX from final intended design.


# Development Instructions & Notes
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
GOOGLE_CLIENT_ID=YYYYYYY
GOOGLE_CLIENT_SECRET=ZZZZZZZZ
HTTPS_PORT=5001
SESSION_SECRET=a_secure_random_string
```

Replace XXXXXX with your MongoDB connection string. To find this string, follow these steps:

1. Navigate to your Atlas project.
2. Click on "Connect" for Cluster0 (this should be visible on the project overview page).
3. Choose "Drivers" to view the connection string.
   Replace `<password>` in the string with your actual password.

Replace YYYYYYY and ZZZZ with the information provided by google. follow these steps:

1. navigate to https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
2. click configure project. 
3. type project name in and next.
4. select web browser as your calling from.
5.copy and past the client id and secret into the .env 

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

### Usage (Depreceated)

Main Page: Displays a list of wildlife tracking posts.

Page Details Page: Will show all post info

Create Post Page: Click the "Create New Post" button on the main page to add a new post. After submitting the form, the new post will be displayed on the main page.


