# WildTrack: The Wildlife Tracker Wikipedia

This project is designed to serve as a centralized repository for information on wildlife trackers, making information that was previously either paywalled or scattered across the web in papers, blogs, and project githubs more accessible to the wildlife researcher community. It is based around the concept of user-created "animal profiles"/"posts" where researchers can independetly outline tracking equipment, methods, recommendations, etc. from their experience.

# Release Notes

## Version 0.5.0

### Features

- **Quality Updates:** Added a list and grid view to show search results in different ways.
- **Ban and Report functionality** Posts can now be reported and users can be banned by the admin.
- **Bookmarks:** Bookmarks now show in your profile page.
- **Small screen updates**: Updated ours screens to look better in smaller screens.

### Bug Fixes
Fixed bug where profile page doesnt load for user's not logged in
Added better and more detailed error handling
### Known Issues
Fixed most major issues 


## Version 0.4.0

### Features

- **Updated UI:** More consistent and flushed out UI site-wide, improved viewability on smaller screens
  - Branding + favicon + How-to-use guide + Filtering UI
- **Profile Page Functionality:** Can now logout, see functional (edit & view) stats and profile description boxes, recent posts etc.
- **Security:** Token Functionality for more secure checks during creating posts and adding images, image upload limits,  & overall data rate limiting
- **Bookmarks:** You can bookmark posts, and view a list of them in your profile
- **Like functionality**: You can now like posts, and sort posts by likes.

### Bug Fixes

- Fixed broken linking between pages
- Fixed non-functioning buttons
- Made image 'bounds-checking' more resilient against bad actors - was ineffective previously

### Known Issues

- Automatic searching as user types in search bar - probably unscalable / UX-undesirable

## Version 0.3.0

### Features

- **Client Modifications**
  - **Post Details**: Added more fields, more entries to dropdowns, more image fields according to new Client Specs
  - **Markdown GUI Change**: Now users only interact with "Markdown preivew."
  - **Branding**: Aligning look with feedback on UI and Branding elements. "How to use" element added.
- **Linking Post and Accounts**: You now have to login before creating a post - posts now associated with users.
- **Search and Filtering Front-end**: Backend now linked with usable frontend.
- **Post Editing Functionality**: You can now edit posts (if you created it) + corresponding front-end UI.
- **User Profile Pages**: ... that show created posts for that user.

### Bug Fixes

- Image and video embed in markdown fixed.
- Sync and displaying issues between input on 'post creation page' and output on the 'published page.'

### Known Issues

- User's profile pages will be expanded on in future sprints according to those future stories.

## Version 0.2.0

### Features

- **Search**: Implemented backend search API (not frontend implemented yet)
- **Google Account Linking**: Can now use google to login to a specific account, will be used for post creation
- **Post Creation Fidelity**: Got instructions from client on what they want from post creation and replaced the previous filler with those reqs, and with a new interface.
- **Post Viewing Fidelity**: Updated 'post' viewing to correctly show the new information from the post creation side.

### Bug Fixes

- Fixed phantom scroll bar on main page
- Corrected linking between 'create post' interface and backend database

### Known Issues

- Search API not linked to front-end yet
- Account login not fully utilized feature-wise: especially for post creation via account.

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

# Installation Guide

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
JWT_SECRET=SomethingsSomethingPleaseChange
```

Replace XXXXXX with your MongoDB connection string. To find this string, follow these steps:

1. Navigate to our Atlas project.
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
