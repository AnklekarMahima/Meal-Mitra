import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function MakePayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [statusMessage, setStatusMessage] = useState("");

  const handlePayment = () => {
    const status = paymentMethod === "Cash on Delivery" ? "Pending" : "Success";
    api
      .post("/payments", {
        order_id: orderId,
        payment_method: paymentMethod,
        payment_status: status,
      })
      .then(() => {
        return api.post("/delivery", {
          order_id: orderId,
          delivery_status: "On the Way",
        });
      })
      .then(() => {
        setStatusMessage("Order placed successfully!");
        setTimeout(() => {
          navigate("/restaurants");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error in payment or delivery creation", err);
        setStatusMessage("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 border border-gray-300 rounded-xl bg-gray-50 shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make Payment</h2>
      <p className="text-gray-700 mb-2">Order ID: {orderId}</p>

      <label className="block mt-6 text-gray-800 font-medium">
        Select Payment Method:
        <select
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-gray-700 text-base"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </label>

      <button
        onClick={handlePayment}
        className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200"
      >
        Pay Now
      </button>

      {statusMessage && (
        <p className="mt-6 font-semibold text-gray-800">{statusMessage}</p>
      )}
    </div>
  );
}

export default MakePayment;