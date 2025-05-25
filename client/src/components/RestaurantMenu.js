import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    api
      .get(`/restaurants/${id}/menu`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const total = Object.values(cart).reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.price),
      0
    );
    setTotalPrice(total);
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.item_id];
      if (existing) {
        return {
          ...prev,
          [item.item_id]: { ...existing, quantity: existing.quantity + 1 }
        };
      }
      return {
        ...prev,
        [item.item_id]: { ...item, quantity: 1 }
      };
    });
  };

  const increaseQty = (item_id) => {
    setCart((prev) => ({
      ...prev,
      [item_id]: {
        ...prev[item_id],
        quantity: prev[item_id].quantity + 1
      }
    }));
  };

  const decreaseQty = (item_id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[item_id].quantity === 1) {
        delete updated[item_id];
      } else {
        updated[item_id].quantity -= 1;
      }
      return updated;
    });
  };

  const placeOrder = () => {
    const user_id = localStorage.getItem("user_id");
    const address_id = localStorage.getItem("address_id");

    if (!user_id || !address_id) {
      alert("Please log in and select an address before placing an order.");
      return;
    }

    const orderItems = Object.values(cart).map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity
    }));

    api
      .post("/orders", {
        user_id,
        address_id,
        restaurant_id: id,
        order_items: orderItems
      })
      .then((response) => {
        setCart({});
        setTotalPrice(0);
        const orderId = response.data.order_id;
        navigate(`/makepayment/${orderId}`);
      })
      .catch((err) => {
        console.error("Failed to place order", err);
        alert("Failed to place order");
      });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-4 md:p-8 gap-4 md:gap-8 bg-gray-50">
      {/* Menu Items Section */}
      <div className="w-full md:w-3/4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <div 
              key={item.item_id} 
              className="bg-white p-4 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.item_name}</h3>
              <p className="text-sm mb-2 text-gray-600">{item.description}</p>
              <p className="font-bold text-gray-800">₹{parseFloat(item.price).toFixed(2)}</p>

              {cart[item.item_id] ? (
                <div className="flex justify-between items-center mt-3 gap-2">
                  <button 
                    onClick={() => decreaseQty(item.item_id)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-gray-800">{cart[item.item_id].quantity}</span>
                  <button 
                    onClick={() => increaseQty(item.item_id)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-md sticky top-4">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Your Cart</h3>
        {Object.values(cart).length === 0 ? (
          <p className="text-gray-500">No items yet</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2">
              {Object.values(cart).map((item) => (
                <li key={item.item_id} className="text-gray-700">
                  {item.item_name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-bold text-lg mb-4">Total: ₹{totalPrice.toFixed(2)}</p>
            <button 
              onClick={placeOrder}
              className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenu;