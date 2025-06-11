import express from "express";
import cors from "cors";
import sequelize from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import userDetailRoutes from "./routes/userDetailRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", scheduleRoutes);
app.use("/api/v1", articleRoutes);
app.use("/api/v1", userDetailRoutes);
app.use("/api/v1", registrationRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.listen(PORT, HOST, async () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
    await sequelize.sync();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
