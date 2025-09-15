# Recipe Hub Backend API

A complete backend API for the Recipe Hub application built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Registration, login with JWT tokens
- **Recipe Management**: Full CRUD operations for recipes
- **Search & Filter**: Search recipes by title, ingredients, or author
- **Security**: Password hashing, JWT authentication, input validation
- **Data Persistence**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and validation

## 📁 Folder Structure

```
recipe-hub-backend/
├── config/
│   └── database.js          # Database configuration
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

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "password": "SecurePass123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /api/recipes?search=chicken&type=non-veg&page=1&limit=10
```

#### Get Single Recipe
```http
GET /api/recipes/:id
```

#### Create Recipe
```http
POST /api/recipes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Chicken Tikka Masala",
  "type": "non-veg",
  "ingredients": "Chicken breast\nYogurt\nTomato puree\nCream\nSpices",
  "instructions": "1. Marinate chicken\n2. Grill chicken\n3. Prepare gravy\n4. Combine and serve"
}
```

#### Update Recipe
```http
PUT /api/recipes/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Recipe Title",
  "type": "veg",
  "ingredients": "Updated ingredients",
  "instructions": "Updated instructions"
}
```

#### Delete Recipe
```http
DELETE /api/recipes/:id
Authorization: Bearer <jwt_token>
```

#### Get My Recipes
```http
GET /api/recipes/my/recipes
Authorization: Bearer <jwt_token>
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

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## 🔧 Testing the API

Use tools like Postman, curl, or any HTTP client:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","name":"Test User","email":"test@example.com","phone":"+91 9876543210","password":"TestPass123"}'
```

## 📱 Frontend Integration

Update your frontend JavaScript to use the API instead of localStorage. See the integration guide in the next section.