import Registration from "../models/Registration.js";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";

export const createRegistration = async (req, res) => {
  const userId = req.userId;

  const { schedule_id } = req.body;

  try {
    // 1. Cari schedule dulu
    const schedule = await Schedule.findByPk(schedule_id);
    if (!schedule) {
      return res
        .status(404)
        .json({ status: "error", message: "Schedule not found" });
    }

    if (schedule.remaining_quota <= 0) {
      return res
        .status(400)
        .json({ message: "Quota is full, cannot register" });
    }

    // 2. Buat registrasi
    const registration = await Registration.create({
      donor_id: userId,
      schedule_id,
      status: "verified",
    });

    // 3. Kurangi kuota schedule
    schedule.remaining_quota -= 1;
    await schedule.save();

    // 4. Ambil data registrasi lengkap dengan user dan schedule
    const fullRegistration = await Registration.findOne({
      where: { id: registration.id },
      include: [
        { model: User, attributes: ["id", "fullname", "email", "phone"] },
        {
          model: Schedule,
          attributes: [
            "id",
            "location",
            "date",
            "start_time",
            "end_time",
            "remaining_quota",
            "quota",
          ],
        },
      ],
    });

    res.status(201).json({
      status: "success",
      data: fullRegistration,
      message: "Registration created successfully",
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        { model: User, attributes: ["id", "fullname", "email", "phone"] },
        {
          model: Schedule,
          attributes: [
            "id",
            "location",
            "date",
            "start_time",
            "end_time",
            "remaining_quota",
            "quota",
          ],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: registrations,
      message: "Registrations fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getRegistrationById = async (req, res) => {
  const { id } = req.params;

  try {
    const registration = await Registration.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "fullname", "email", "phone"] },
        {
          model: Schedule,
          attributes: [
            "id",
            "location",
            "date",
            "start_time",
            "end_time",
            "remaining_quota",
            "quota",
          ],
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: registration,
      message: "Registration fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateStatusRegistrationById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["verified", "completed", "no_show"];
  if (!allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid status value" });
  }

  try {
    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res
        .status(404)
        .json({ status: "error", message: "Registration not found" });
    }

    // Update status
    registration.status = status;
    await registration.save();

    // Ambil data lengkap
    const fullRegistration = await Registration.findOne({
      where: { id: registration.id },
      include: [
        { model: User, attributes: ["id", "fullname", "email", "phone"] },
        {
          model: Schedule,
          attributes: [
            "id",
            "location",
            "date",
            "start_time",
            "end_time",
            "remaining_quota",
            "quota",
          ],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: fullRegistration,
      message: "Registration status updated successfully",
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
