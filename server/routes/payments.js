import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { order_id, payment_method, payment_status } = req.body;

  try {
    const orderResult = await db.query(
      "SELECT Total_Amount FROM Orders WHERE Order_ID = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const amount = orderResult.rows[0].total_amount;

    const result = await db.query(
      `INSERT INTO Payments (Order_ID, Payment_Method, Amount, Payment_Status, Payment_Date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *`,
      [order_id, payment_method, amount, payment_status]
    );

    res.json({ message: "Payment recorded", payment: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
});

router.get("/:order_id", async (req, res) => {
  const { order_id } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM Payments WHERE Order_ID = $1",
      [order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No payment found for this order" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
});

export default router;