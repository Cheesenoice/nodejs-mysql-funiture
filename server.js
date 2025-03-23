const express = require("express");
const session = require("express-session");
const cors = require("cors"); // Thêm cors
const sequelize = require("./src/config/db");
const setupRoutes = require("./src/routes");
require("dotenv").config();

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Thay bằng domain frontend của bạn
    credentials: true, // Cho phép gửi cookie/session
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

setupRoutes(app);

const PORT = process.env.PORT || 3000;
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection error:", err));
