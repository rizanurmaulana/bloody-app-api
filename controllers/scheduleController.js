import Schedule from "../models/Schedule.js";
import User from "../models/User.js";

export const createSchedule = async (req, res) => {
  const { pmi_id, location, date, start_time, end_time, quota, status, image } =
    req.body;

  const imagePath = req.file ? req.file.filename : null;

  try {
    const user = await User.findByPk(pmi_id);
    if (!user || user.role !== "hospital") {
      return res.status(400).json({
        status: "error",
        message: "Invalid PMI ID: user not found or not a PMI",
      });
    }

    const schedule = await Schedule.create({
      pmi_id,
      location,
      date,
      start_time,
      end_time,
      quota,
      remaining_quota: quota,
      status: "available",
      image: imagePath,
    });

    res.status(201).json({
      status: "success",
      data: schedule,
      message: "Schedule created successfully",
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        {
          model: User,
          as: "pmi",
          attributes: ["id", "fullname", "role"],
          where: { role: "hospital" },
          required: true, // memastikan hanya yang relasi PMI valid
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: schedules,
      message: "Schedules fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "pmi",
          attributes: ["id", "fullname", "role"],
          where: { role: "hospital" },
          required: true,
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({
        status: "error",
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: schedule,
      message: "Schedule fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Update Schedule By ID
export const updateScheduleById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        status: "error",
        message: "Schedule not found",
      });
    }

    const allowedFields = [
      "pmi_id",
      "location",
      "date",
      "start_time",
      "end_time",
      "quota",
      "remaining_quota",
      "status",
      "image",
    ];

    Object.entries(updates).forEach(([key, value]) => {
      if (
        allowedFields.includes(key) &&
        value !== undefined &&
        value !== null
      ) {
        schedule[key] = value;
      }
    });

    if (req.file) {
      schedule.image = req.file.filename; // sesuaikan dengan nama file yang disimpan
    }

    await schedule.save();

    res.status(200).json({
      status: "success",
      data: schedule,
      message: "Schedule updated successfully",
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
