import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import deliveryRoutes from "./routes/delivery.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/delivery", deliveryRoutes);

app.get("/", (req, res) => {
  console.log("Base route hit");
  res.send("Food Ordering API is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



