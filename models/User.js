

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[A-Za-z][A-Za-z0-9_]{2,19}$/, 'Username must start with a letter and contain only letters, numbers, and underscores']
  },
  
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^(?!.*\s{2})[A-Za-z ]{2,50}$/, 'Name can only contain letters and single spaces']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
   
    select: false 
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, 
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});


userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();
  
  try {

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};


userSchema.statics.findByCredentials = async function(identifier) {
  const user = await this.findOne({
    $or: [
      { username: identifier },
      { email: identifier.toLowerCase() }
    ]
  }).select('+password');
  
  return user;
};


userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  return await this.save();
};

module.exports = mongoose.model('User', userSchema);