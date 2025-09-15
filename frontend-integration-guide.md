# Frontend Integration Guide

This guide shows how to modify your existing frontend HTML/JavaScript files to work with the new backend API.

## 🔧 Required Changes

### 1. Add API Configuration

Add this to the top of each JavaScript section in your HTML files:

```javascript

const API_BASE_URL = 'http://localhost:5000/api';


async function makeApiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };


  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### 2. Update register.html

Replace the registration JavaScript with:

```javascript

document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value.trim();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  
  if (!document.getElementById('agreeTerms').checked) {
    showError('You must agree to the terms and conditions');
    return;
  }

  const registerButton = document.querySelector('button[type="submit"]');
  const originalText = registerButton.innerHTML;
  registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  registerButton.disabled = true;

  try {
    const response = await makeApiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, name, email, phone, password })
    });

    showSuccess('Registration successful! Redirecting to login...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);

  } catch (error) {
    showError(error.message);
    registerButton.innerHTML = originalText;
    registerButton.disabled = false;
  }
});
```

### 3. Update login.html

Replace the login JavaScript with:

```javascript

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showError('Please fill in all fields');
    return;
  }

  const loginButton = document.querySelector('button[type="submit"]');
  const originalText = loginButton.innerHTML;
  loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  loginButton.disabled = true;

  try {
    const response = await makeApiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });


    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));

    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = 'main.html';
    }, 1500);

  } catch (error) {
    showError(error.message);
    loginButton.innerHTML = originalText;
    loginButton.disabled = false;
  }
});
```

### 4. Update main.html

Replace the recipe management JavaScript with:

```javascript

function checkAuth() {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!token || !user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

async function loadRecipes() {
  try {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    let endpoint = '/recipes?';
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (activeFilter !== 'all') params.append('type', activeFilter);
    
    endpoint += params.toString();
    
    const response = await makeApiCall(endpoint);
    displayRecipes(response.recipes);
    
  } catch (error) {
    console.error('Error loading recipes:', error);
    showError('Failed to load recipes');
  }
}


function displayRecipes(recipes) {
  const recipeGrid = document.getElementById('recipeGrid');
  recipeGrid.innerHTML = '';
  
  if (recipes.length === 0) {
    recipeGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-utensils"></i>
        <h3>No recipes found</h3>
        <p>Try a different search term or add your first recipe!</p>
      </div>
    `;
    return;
  }
  
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <div class="veg-indicator ${recipe.type === 'veg' ? 'veg' : 'non-veg'}">
        <i class="fas ${recipe.type === 'veg' ? 'fa-leaf' : 'fa-drumstick-bite'}"></i>
      </div>
      <h3>${recipe.title}</h3>
      <p class="author">By: ${recipe.author}</p>
      <p class="ingredients-preview">${recipe.ingredients.split('\n').slice(0, 3).join(', ')}${recipe.ingredients.split('\n').length > 3 ? '...' : ''}</p>
      <button onclick="openRecipeModal('${recipe.id}')">View Recipe</button>
    `;
    recipeGrid.appendChild(recipeCard);
  });
}


async function openRecipeModal(recipeId) {
  try {
    const response = await makeApiCall(`/recipes/${recipeId}`);
    const recipe = response.recipe;
    
    document.getElementById('modalTitle').textContent = recipe.title;
    
    
    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = '';
    recipe.ingredients.split('\n').forEach(ingredient => {
      if (ingredient.trim()) {
        const li = document.createElement('li');
        li.textContent = ingredient.trim();
        ingredientsList.appendChild(li);
      }
    });
    
    document.getElementById('modalInstructions').textContent = recipe.instructions;
    document.getElementById('recipeModal').style.display = 'flex';
    
  } catch (error) {
    console.error('Error loading recipe:', error);
    alert('Failed to load recipe details');
  }
}


async function saveRecipeData(title, type, ingredients, instructions) {
  try {
    const form = document.getElementById('recipeForm');
    const recipeId = form.dataset.editId;
    
    const endpoint = recipeId ? `/recipes/${recipeId}` : '/recipes';
    const method = recipeId ? 'PUT' : 'POST';
    
    const response = await makeApiCall(endpoint, {
      method,
      body: JSON.stringify({ title, type, ingredients, instructions })
    });
    
    closeAddEditModal();
    loadRecipes();
    
  } catch (error) {
    console.error('Error saving recipe:', error);
    alert('Failed to save recipe: ' + error.message);
  }
}
```

### 5. Update profile.html

Replace the profile management JavaScript with:

```javascript

async function loadUserProfile() {
  try {
    const response = await makeApiCall('/auth/profile');
    const user = response.user;
    
    document.getElementById('profileUsername').value = user.username;
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePhone').value = user.phone;
    
  } catch (error) {
    console.error('Error loading profile:', error);
    showError('Failed to load profile');
  }
}


async function loadUserRecipes() {
  try {
    const response = await makeApiCall('/recipes/my/recipes');
    displayUserRecipes(response.recipes);
    
  } catch (error) {
    console.error('Error loading recipes:', error);
    showError('Failed to load your recipes');
  }
}

function displayUserRecipes(recipes) {
  const recipeList = document.getElementById('myRecipeList');
  const emptyState = document.getElementById('emptyRecipes');
  
  recipeList.innerHTML = '';
  
  if (recipes.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <div class="veg-indicator ${recipe.type === 'veg' ? 'veg' : 'non-veg'}">
        <i class="fas ${recipe.type === 'veg' ? 'fa-leaf' : 'fa-drumstick-bite'}"></i>
      </div>
      <h3>${recipe.title}</h3>
      <p class="author">By: ${recipe.author}</p>
      <p class="ingredients-preview">${recipe.ingredients.split('\n').slice(0, 3).join(', ')}${recipe.ingredients.split('\n').length > 3 ? '...' : ''}</p>
      <div class="recipe-actions">
        <button class="btn-edit" onclick="openEditModal('${recipe.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-danger" onclick="openDeleteModal('${recipe.id}', '${recipe.title.replace(/'/g, "\\'")}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    recipeList.appendChild(recipeCard);
  });
}


async function openEditModal(recipeId) {
  try {
    const response = await makeApiCall(`/recipes/${recipeId}`);
    const recipe = response.recipe;
    
    document.getElementById('editRecipeId').value = recipe.id;
    document.getElementById('editRecipeTitle').value = recipe.title;
    document.getElementById('editRecipeType').value = recipe.type;
    document.getElementById('editRecipeIngredients').value = recipe.ingredients;
    document.getElementById('editRecipeInstructions').value = recipe.instructions;
    
    document.getElementById('editModal').style.display = 'flex';
    
  } catch (error) {
    console.error('Error loading recipe for edit:', error);
    alert('Failed to load recipe for editing');
  }
}


async function deleteRecipe(recipeId) {
  try {
    await makeApiCall(`/recipes/${recipeId}`, { method: 'DELETE' });
    loadUserRecipes(); 
    
  } catch (error) {
    console.error('Error deleting recipe:', error);
    alert('Failed to delete recipe: ' + error.message);
  }
}
```

## 🚀 Getting Started

1. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

2. **Update Frontend Files**: Apply the changes above to your HTML files

3. **Test the Integration**:
   - Open `register.html` and create a new account
   - Login with `login.html`
   - Create and manage recipes in `main.html`
   - View your profile in `profile.html`

4. **CORS Configuration**: The backend already includes CORS middleware to allow requests from your frontend

## 🔧 Environment Setup

Make sure your `.env` file is configured:
```env
MONGODB_URI=mongodb://localhost:27017/recipe_hub
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## 📱 Production Deployment

When deploying to production:
1. Update `API_BASE_URL` in frontend to your production API URL
2. Set production MongoDB connection string
3. Use environment variables for sensitive data
4. Enable HTTPS for secure token transmission

Your Recipe Hub application now has a robust, scalable backend with proper authentication, data validation, and error handling!