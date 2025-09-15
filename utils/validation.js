
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidUsername = (username) => {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
  return usernameRegex.test(username);
};


const isValidName = (name) => {
  const nameRegex = /^(?!.*\s{2})[A-Za-z ]{2,50}$/;
  return nameRegex.test(name);
};


const isValidIndianPhone = (phone) => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};


const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
};


const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

const isValidRecipeType = (type) => {
  return ['veg', 'non-veg'].includes(type);
};

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidName,
  isValidIndianPhone,
  isStrongPassword,
  sanitizeInput,
  isValidRecipeType
};