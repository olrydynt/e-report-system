const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// =======================
// 1. USER SCHEMA
// =======================
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    contactNumber: {
      type: String
    },

    profileImage: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);


// =======================
// 2. PASSWORD HASHING
// =======================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// =======================
// 3. PASSWORD COMPARISON
// =======================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// =======================
// 4. EXPORT MODEL
// =======================
module.exports = mongoose.model("User", userSchema);