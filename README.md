# 🍲 Recipe Sharing Hub

## 📖 Overview  
**Recipe Sharing Hub** is a full-stack web application that allows food enthusiasts to share, discover, and manage recipes on a single platform. It provides a seamless experience for users to create accounts, post their favorite recipes, browse others’ creations, and connect with fellow food lovers.

This platform is built with a robust tech stack and a modern DevOps workflow using **CI/CD pipelines**, **containerization**, and **Kubernetes orchestration** to ensure **scalability, reliability, and continuous delivery**.

---

## ✨ Features  
- 🔐 **User Authentication** — Secure registration and login with JWT-based authentication  
- ✍️ **Recipe Management** — Create, edit, delete recipes with ingredients and preparation steps  
- 🔎 **Search & Filter** — Find recipes by title, ingredients, author, or dietary type (veg/non-veg)  
- 🧑‍🤝‍🧑 **User Profiles** — View recipes created by specific users  
- ⚡ **Interactive UI** — Clean, responsive, and user-friendly frontend  
- ⚙️ **CI/CD Integration** — Jenkins pipeline for automated build and test  
- 📦 **Containerized Deployment** — Dockerized app deployed and orchestrated via Kubernetes  
- ✅ **Testing** — Manual and automated test coverage  

---

## 🛠 Tech Stack

| Layer          | Technology                       |
|----------------|----------------------------------|
| **Frontend**   | HTML, CSS, JavaScript            |
| **Backend**    | Node.js (Express.js)             |
| **Database**   | MongoDB                          |
| **CI/CD**      | Jenkins (integrated with GitHub) |
| **Deployment** | Docker, Kubernetes               |
| **Testing**    | Manual & automated tests         |

---

## 👥 Team

| Roll Number | Name               | Roles & Responsibilities          |
|-------------|--------------------|-----------------------------------|
| 23211A6766  | M. Sai Ravalika    | Kubernetes, Backend Development   |
| 23211A6767  | M. Shriya          | Frontend Development              |
| 23211A6772  | M. Harshitha       | Deployment                        |
| 23211A6780  | N. Harini          | Jenkins CI/CD, GitHub Integration |
| 23211A67A2  | R. Manvitha        | Docker, Authentication, Backend   |
| 23211A67A8  | S. Sanjana         | GitHub Repository Management      |
| 23211A67C5  | Zunera             | Testing                           |

---

## 📌 Members’ Contribution Summary  

### 👩‍💻 **S. Sanjana (23211A67A8)**
- Managed GitHub repository & version control  
- Implemented branching strategy and pull request workflow  
- Resolved merge conflicts  
- Reviewed and merged pull requests  

### 👩‍💻 **M. Shriya (23211A6767)**
- Built responsive UI using HTML, CSS, JavaScript  
- Implemented recipe search and filtering (veg/non-veg)  
- Added client-side validations and error handling  

### 👩‍💻 **N. Harini (23211A6780)**
- Set up project repository  
- Configured Jenkins CI/CD pipeline  
- Integrated GitHub with Jenkins  
- Automated build and test pipeline with notifications  

### 👩‍💻 **Zunera Amber (23211A67C5)**
- Preparing test cases – **in progress**

### 👩‍💻 **R. Manvitha (23211A67A2)**
- Integrated frontend with backend APIs  
- Designed MongoDB schema  
- Added robust validation and error handling  

### 👩‍💻 **M. Sai Ravalika (23211A6766)**
- Developed backend APIs using Node.js and Express.js  
- Implemented password hashing, JWT authentication, and input validation  
- Managed user registration and login logic
- Kubernetes setup – **yet to be started**


### 👩‍💻 **M. Harshitha (23211A6772)**
- Responsible for deployment **yet to be started**

---

## 📁 Project Structure

```
recipe-hub-backend/
├── config/
│   └── database.js          # Database configuration
├── frontend/
│   ├── login.html
│   ├── login.jpg
│   ├── main.html
│   ├── profile.html
│   ├── register.html          
│   └── register.jpg          
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User data model
│   └── Recipe.js            # Recipe data model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── recipes.js           # Recipe management routes
│   └── users.js             # User management routes
├── utils/
│   └── validation.js        # Validation utilities
├── .env                     # Environment variables
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/recipe_hub
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

### 4. Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```


## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## ✅ Data Validation

- **Username**: 3-20 characters, starts with letter, only letters/numbers/underscores
- **Email**: Valid email format
- **Phone**: Indian phone number format (+91 XXXXXXXXXX)
- **Password**: Minimum 8 characters with uppercase, lowercase, and number
- **Recipe Title**: 3-100 characters
- **Recipe Ingredients**: Minimum 10 characters
- **Recipe Instructions**: Minimum 20 characters

## 🚀 Future Enhancements

Here are some planned improvements and features to enhance the functionality and user experience of the Recipe Sharing Hub:

- 💬 **Comments & Ratings** — Allow users to comment on and rate recipes
- 🖼️ **Image Upload** — Enable users to upload images of their dishes
- 🔐 **Social Authentication** — Login using Google account
- 📱 **PWA (Progressive Web App)** — Add offline support and installable app features
- 📌 **Bookmark & Favorites** — Save recipes to personal collections
- 🌐 **Multi-language Support** — Localize the UI for different languages

