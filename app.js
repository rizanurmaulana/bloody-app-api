import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
    await sequelize.sync();
    console.log("Database & tables created!");

    // Cek dan buat folder uploads jika belum ada
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log("Folder 'uploads' created.");
    }

    app.use("/api/v1", authRoutes);
    app.use("/api/v1", userRoutes);
    app.use("/api/v1", scheduleRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

init();
