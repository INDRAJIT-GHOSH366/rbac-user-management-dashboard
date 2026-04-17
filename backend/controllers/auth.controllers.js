import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist." });
    }

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required." });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      fullName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "user", 
      status: "active",
    });

   
    newUser.createdBy = newUser._id;
    await newUser.save();

    const token = await genToken(newUser);

    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(newUser);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    //const user = await User.findOne({ email });
    const emailNormalized = email.trim().toLowerCase();//
    let user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect Password" });
      }
    const token = await genToken(user);
    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`Sign In error ${error}`);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "log out sucessfully" });
  } catch (error) {
    return res.status(500).json(`sign out error ${error}`);
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "OTP sent to your email address." });
  } catch (error) {
    return res.status(500).json(`Send otp error ${error}`);
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }

    if (!user || !user.resetOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "invalid /expire otp" });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isOtpVerified = true;
    user.resetOtp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({ message: "OTP verify sucessfully" });
  } catch (error) {
    return res.status(500).json(`Verify otp error ${error}`);
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset sucessfully" });
  } catch (error) {
    return res.status(500).json(`Reset password error ${error}`);
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, role  } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        role,
        password: "",
      });
    }
    const token = await genToken(user);
    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`GoogleAuth error ${error}`);
  }
};
