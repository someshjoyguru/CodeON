import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  phone: {
    type: String,
    length: 10,
    unique: [true, "Phone number already exists"],
  },
  registrationNo: {
    type: String,
    length: 11,
    unique: [true, "Registration number already exists"],
  },
  shirtSize: {
    type: String,
  },
  codeforces: {
    type: String,
    unique: [true, "Codeforces handle already exists"],
  },
  codeforcesRating: {
    type: String,
    default: "0",
  },
  streak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
});

export const User = mongoose.model("User", schema);
