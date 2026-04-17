import User from "../models/user.model.js";
import bcrypt from "bcrypt";


const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User Id not found" });
    }

    const user = await User.findById(userId).select(
      "fullName role email status"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const editUserNameAndPassword = async (req, res) => {
  try {
    const { fullName, password, oldPassword } = req.body;

    if (!fullName && !password) {
      return res
        .status(400)
        .json({ message: "No data provided to update" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name
    if (fullName) {
      user.fullName = fullName;
    }

    // Update password
    if (password) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Old password required" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Old password incorrect" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      user.password = await bcrypt.hash(password, 10);
    }

  
    user.updatedBy = req.userId;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search?.trim() || "";

    const skip = (page - 1) * limit;

    let query = { role: "user" };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .populate("createdBy", "fullName email")
      .populate("updatedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getManagers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search?.trim() || "";

    const skip = (page - 1) * limit;

    let query = { role: "manager" };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalManagers = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .populate("createdBy", "fullName email")
      .populate("updatedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(totalManagers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = await User.findById(req.userId);

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userIdToUpdate = req.params.id;

    const allowedRoles = ["user", "manager", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const currentUser = await User.findById(req.userId);

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (req.userId === userIdToUpdate) {
      return res
        .status(400)
        .json({ message: "Cannot change your own role" });
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    user.updatedBy = req.userId;

    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,

      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const currentUser = await User.findById(req.userId);

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
      status: "active",
      createdBy: req.userId,
      updatedBy: req.userId,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getCurrentUser;