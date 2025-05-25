import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { phone, name, address_line, city, state, pincode } = req.body;

  try {
    const user = await db.query("SELECT * FROM Users WHERE phone = $1", [phone]);

    if (user.rows.length > 0) {
      const addressResult = await db.query(
        "SELECT * FROM User_Addresses WHERE User_ID = $1",
        [user.rows[0].user_id]
      );

      res.json({
        message: "Login successful",
        user: user.rows[0],
        address: addressResult.rows.length > 0 ? addressResult.rows[0] : null 
      });
    } else {
      const newUserResult = await db.query(
        "INSERT INTO Users (Name, Phone) VALUES ($1, $2) RETURNING *",
        [name, phone]
      );

      const newUser = newUserResult.rows[0];
      let addressResult = null;

      if (address_line && city && state && pincode) {
        addressResult = await db.query(
          "INSERT INTO User_Addresses (User_ID, Address_Line, City, State, Pincode) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [newUser.user_id, address_line, city, state, pincode]
        );
      }

      res.json({
        message: "User registered",
        user: newUser,
        ...(addressResult ? { address: addressResult.rows[0] } : {})
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;