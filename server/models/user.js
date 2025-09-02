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
    trim: true,
    lowercase: true,
    validate: {
        validator: (value) => {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    required: true,
    type: String,
    select: false,
    validate: {
        validator: (value) => {
            return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value);            ;
        },
        message: props => `Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
    }
  },
  phone: {
    type: String,
    length: 10,
    unique: [true, "Phone number already exists"],
    sparse: true,
    validate: {
      validator: function(v) {
        if (!v || v.trim() === '') return true;
        return /\d{10}/.test(v);
      },
      message: "Invalid phone number format"
    }
  },
  registrationNo: {
    type: String,
    length: 11,
    unique: [true, "Registration number already exists"],
    sparse: true,
  },
  shirtSize: {
    type: String,
  },
  codeforces: {
    type: String,
    unique: [true, "Codeforces handle already exists"],
    sparse: true,
  },
  codeforcesRating: {
    type: String,
    default: "0",
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
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
