const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, required: true, default: false},
  createdDate: { type: Date, default: Date.now, required: true},
  updatedDate: { type: Date, default: Date.now, required: true},
});

// Hash password before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', userSchema);
