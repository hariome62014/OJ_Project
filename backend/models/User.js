const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures usernames are unique
      trim: true,   // Removes whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures emails are unique
      trim: true,
      lowercase: true, // Stores email in lowercase
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Only allows 'user' or 'admin'
      default: 'user',         // Default role is 'user'
    },
    token: {
			type: String,
		},
    resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
			required: true,
		},
    solvedProblems: [{
      type: Schema.Types.ObjectId,
      ref: 'Problem', // References the 'Problem' model
    }],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;