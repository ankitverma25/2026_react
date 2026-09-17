import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      const error = new Error("user already there.");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "user registered successfully",
      user: {
        id: createUser._id,
        name: createUser.name,
        email: createUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("user email was not there.");
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Password is invalid");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const getMyProfile = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
        
    } catch (error) {
        next(error)
    }
    
}