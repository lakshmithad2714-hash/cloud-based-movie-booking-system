const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailOTP: { type: String },
  phoneOTP: { type: String },
  city: { type: String, default: 'Bangalore' },
  wishlist: [{ type: String }],
  otpExpiry: { type: Date },
  lastLogin: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
