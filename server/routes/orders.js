import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, address_id, restaurant_id, order_items } = req.body;

  try {
    let total_amount = 0;
    const detailedItems = [];

    for (const item of order_items) {
      const itemRes = await db.query(
        "SELECT price FROM Menu_Items WHERE item_id = $1",
        [item.item_id]
      );

      if (itemRes.rows.length === 0) {
        return res.status(400).json({ error: `Invalid item_id: ${item.item_id}` });
      }

      const price = itemRes.rows[0].price;
      const itemTotal = price * item.quantity;
      total_amount += itemTotal;

      detailedItems.push({
        item_id: item.item_id,
        quantity: item.quantity,
        price_at_order: price
      });
    }

    const orderResult = await db.query(
      "INSERT INTO Orders (User_ID, Address_ID, Restaurant_ID, Order_Date, Total_Amount) VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING *",
      [user_id, address_id, restaurant_id, total_amount]
    );

    const orderId = orderResult.rows[0].order_id;

    for (const item of detailedItems) {
      await db.query(
        "INSERT INTO Order_Items (Order_ID, Item_ID, Quantity, Price_At_Order) VALUES ($1, $2, $3, $4)",
        [orderId, item.item_id, item.quantity, item.price_at_order]
      );
    }

    res.json({ message: "Order placed successfully", order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM Orders WHERE User_ID = $1 ORDER BY Order_Date DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;