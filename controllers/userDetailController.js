import UserDetail from "../models/UserDetail.js";

export const createUserDetail = async (req, res) => {
  const userId = req.userId;

  const {
    user_id,
    gender,
    birthdate,
    blood_type,
    weight,
    status,
    address,
    last_donation_date,
    total_donations,
    image,
  } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  try {
    const user_detail = await UserDetail.create({
      user_id: userId,
      gender,
      birthdate,
      blood_type,
      weight,
      status: "active",
      address,
      last_donation_date,
      total_donations: 0,
      image: imagePath,
    });

    res.status(201).json({
      status: "success",
      data: user_detail,
      message: "User Detail created successfully",
    });
  } catch (error) {
    console.error("Error creating user detail:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    const user_details = await UserDetail.findAll();

    res.status(200).json({
      status: "success",
      data: user_details,
      message: "User Details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getUserDetailById = async (req, res) => {
  // const { id } = req.params;
  const userId = req.userId;

  try {
    const user_detail = await UserDetail.findOne({
      where: { user_id: userId },
    });
    if (!user_detail) {
      return res.status(404).json({
        status: "error",
        message: "User Detail not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user_detail,
      message: "User Detail fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user detail:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateUserDetailById = async (req, res) => {
  // const { id } = req.params;
  const userId = req.userId;
  const updates = req.body;

  try {
    const user_detail = await UserDetail.findOne({
      where: { user_id: userId },
    });
    if (!user_detail) {
      return res.status(404).json({
        status: "error",
        message: "User Detail not found",
      });
    }

    const allowedFields = [
      "user_id",
      "gender",
      "birthdate",
      "blood_type",
      "weight",
      "status",
      "address",
      "last_donation_date",
      "total_donations",
      "image",
    ];

    Object.entries(updates).forEach(([key, value]) => {
      if (
        allowedFields.includes(key) &&
        value !== undefined &&
        value !== null
      ) {
        user_detail[key] = value;
      }
    });

    if (req.file) {
      user_detail.image = req.file.filename;
    }

    await user_detail.save();

    res.status(200).json({
      status: "success",
      data: user_detail,
      message: "User Detail updated successfully",
    });
  } catch (error) {
    console.error("Error updating user detail:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
