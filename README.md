

# IdeaSphere

> An AI-powered startup idea validation and collaboration platform.

## Overview

IdeaSphere is a full-stack web platform designed to help users capture, organize, validate, and develop startup ideas from concept to execution.

The platform combines idea management, AI-powered validation, analytics, collaboration tools, and secure user authentication into one workspace.

## Features

### Idea Management

- Create and manage startup ideas
- Store ideas securely in MongoDB
- View and edit idea details
- Explore ideas
- Save ideas for later

### AI Idea Validator

- AI-powered startup idea analysis
- Innovation and feasibility insights
- Market and revenue analysis
- Strengths and weaknesses
- Improvement suggestions

### Authentication and Security

- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Forgot password functionality
- Secure password reset
- Email-based password recovery

### Productivity and Workspace

- Analytics dashboard
- Collaboration hub
- Workspace management
- Saved ideas
- Notifications
- Profile management
- Settings

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt.js
- Nodemailer

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### AI

- Google Gemini API

### Development Tools

- Git
- GitHub
- Visual Studio Code

## Architecture

```text
IdeaSphere Frontend
        |
        | REST API
        v
Node.js + Express.js
        |
        +--------------> Google Gemini API
        |
        +--------------> Email Service
        |
        v
MongoDB / MongoDB Atlas


\-------------------------------------------------------------------------------------------------------------------------------------------------------
PROJECT STRUCTURE

IdeaSphere/
|
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .gitignore
│   ├── app.js
│   ├── package.json
│   └── server.js
|
├── js/
│   └── api.js
|
├── ai-validator.html
├── create-idea.html
├── explore-ideas.html
├── home.html
├── login.html
├── signup.html
├── forgot-password.html
├── reset-password.html
├── saved-ideas.html
├── analytics.html
├── collaborate.html
├── workspace.html
├── settings.html
├── project-details.html
└── README.md

\----------------------------------------------------------------------------------------------------------------------------------------------------



** Getting Started**

**1. Clone the repository**

git clone https://github.com/Keerthana-4-git/IdeaSphere.git

cd IdeaSphere





**2. Install backend dependencies**

cd backend

npm install





**3. Configure environment variables**



Create a .env file inside the backend directory.



GEMINI\_API\_KEY=your\_gemini\_api\_key

GEMINI\_MODEL=your\_gemini\_model

MONGODB\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret

PORT=5000

EMAIL\_USER=your\_email

EMAIL\_PASS=your\_email\_app\_password



Never commit your .env file. It contains private credentials and API keys.



**4. Start the backend**

npm start



The backend runs locally on:



http://localhost:5000



**5. Run the frontend**



Open the frontend using a local development server such as VS Code Live Server.



The frontend communicates with the Express backend through REST APIs.



** Security**

Passwords are hashed using bcrypt

Authentication uses JWT

Sensitive credentials are stored in environment variables

.env is excluded from Git

node\_modules is excluded from Git

API keys are not stored in frontend code



** Future Improvements**

Production deployment

Enhanced real-time collaboration

Advanced AI validation

Improved cloud synchronization

Dark mode

Additional analytics

UI/UX refinement

Performance optimization



** Developer**



Keerthana



Computer Science \& Design Student

Built IdeaSphere as a full-stack AI-powered product.




