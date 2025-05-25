
import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { order_id, delivery_status } = req.body;

  try {
    const status = delivery_status || "Pending"; 

    const result = await db.query(
      `INSERT INTO Delivery (Order_ID, Delivery_Status, Delivery_Date)
       VALUES ($1, $2, CURRENT_DATE) RETURNING *`,
      [order_id, status]
    );

    res.json({ message: "Delivery record created", delivery: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create delivery record" });
  }
});

router.get("/:order_id", async (req, res) => {
  const { order_id } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM Delivery WHERE Order_ID = $1",
      [order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No delivery info found for this order" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch delivery details" });
  }
});

export default router;