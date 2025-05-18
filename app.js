import express from "express";
import cors from "cors";
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

    app.use("/api/v1", authRoutes);
    app.use("/api/v1", userRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

init();
