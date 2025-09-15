# 🍲 Recipe Sharing Hub

## Project Description  
**Recipe Sharing Hub** is a full-stack web application designed for food lovers to share, discover, and organize recipes in one place. The platform allows users to:  
- **Register & Login** to create a secure account.  
- **Create, edit, and delete recipes** with ingredients, preparation steps. 
- **Browse and search recipes** shared by other users in an interactive feed.  
- **View user profiles** to explore recipes contributed by specific members.  

The application is built with a modern development workflow including **CI/CD pipelines, containerization, and Kubernetes orchestration**, making it both scalable and reliable.  
 
---

## 🛠Tech Stack
**Frontend:** HTML, CSS, JavaScript  
**Backend:** Node.js (Express)  
**Database:** MongoDB  
**CI/CD:** Jenkins (GitHub integrated)  
**Deployment:** Docker containers, Kubernetes  
**Testing:** Manual and automated tests  

---

## Team
| Roll Number | Name            | Roles & Responsibilities      |
|-------------|-----------------|-------------------------------|
| 23211A6766  | M. Sai Ravalika | Kubernetes, Coding            |
| 23211A6767  | M. Shriya       | Coding                        |
| 23211A6772  | M. Harshitha    | Deployment                    |
| 23211A6780  | N. Harini       | Jenkins, GitHub               |
| 23211A67A2  | R. Manvitha     | Docker, Coding                |
| 23211A67A8  | S. Sanjana      | GitHub                        |
| 23211A67C5  | Zunera          | Testing                       |




## 📁 Folder Structure

```
recipe-hub-backend/
├── config/
│   └── database.js          # Database configuration
├── frontend/
│   ├── login.html
│   ├── login.jpg
│   ├── main.html
│   ├── profile.html
│   ├── register.html           # Recipe management routes
│   └── register.jpg             # User management routes
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
- **Ingredients**: Minimum 10 characters
- **Instructions**: Minimum 20 characters



Update your frontend JavaScript to use the API instead of localStorage. See the integration guide in the next section.
