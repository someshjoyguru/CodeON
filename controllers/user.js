import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
import { cloudinary } from "../app.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email or Password", 400));

    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    console.log(name, email, password);
    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByName = await User.findOne({ name });
    if (existingUserByEmail || existingUserByName) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Send success response
    sendCookie(newUser, res, "Registered successfully.", 201);
  } catch (error) {
    // Handle errors
    console.error("Registration error:", error);
    return res.status(500).json({ message: `${error.message}` });
  }
};


export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};

export const updateProfile = async (req, res, next) => {
  const {phone, registrationNo, shirtSize, codeforces, codeforcesRating, image } =
  req.body;
  
  try {
    let result;
    if (image){
      result = await cloudinary.uploader.upload(image, {
        folder: "profile",
    });
    }

    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    if (result) {
      user.image.public_id = result.public_id;
      user.image.url = result.secure_url;
    }

    user.phone = phone;
    user.registrationNo = registrationNo;
    user.shirtSize = shirtSize;
    user.codeforces = codeforces;
    user.codeforcesRating = codeforcesRating;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export const giveUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

