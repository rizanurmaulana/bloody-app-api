import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createUser = async (req, res) => {
  const { email, fullname, phone, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const user = await User.create({
      email,
      fullname,
      phone,
      password,
      role,
    });

    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      status: "success",
      data: userData,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: false },
      attributes: { exclude: ["password"] },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No users found",
      });
    }

    res.status(200).json({
      status: "success",
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id, is_deleted: false },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  console.log(req.userId);

  try {
    const user = await User.findByPk(id);
    if (!user || user.is_deleted) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (req.userRole !== "admin" && req.userId !== parseInt(id)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    if (updates.email) {
      const emailExists = await User.findOne({
        where: {
          email: updates.email,
          id: { [Op.ne]: id },
          is_deleted: false,
        },
      });

      if (emailExists) {
        return res.status(409).json({
          status: "error",
          message: "Email already in use by another user",
        });
      }
    }

    if ("password" in updates) {
      delete updates.password;
    }

    const allowedFields = ["email", "fullname", "phone", "role"];
    Object.entries(updates).forEach(([key, value]) => {
      if (
        allowedFields.includes(key) &&
        value !== undefined &&
        value !== null
      ) {
        user[key] = value;
      }
    });

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      status: "success",
      data: userData,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user || user.is_deleted) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (req.userRole !== "admin" && req.userId !== parseInt(id)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user || user.is_deleted) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (req.userRole !== "admin" && req.userId !== parseInt(id)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    user.is_deleted = true;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
