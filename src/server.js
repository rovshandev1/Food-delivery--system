require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courierRoutes = require("./routes/courierRoutes");
const connectDB = require("./config/database");

const app = express();
app.use(express.json());

// Yo'nalishlarni ulash
app.use("/auth", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menus", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/couriers", courierRoutes);

// Mongodb ga ulanish
connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portida ishga tushirildi`));
