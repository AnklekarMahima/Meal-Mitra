import React from "react";
import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurants/${restaurant.restaurant_id}/menu`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white text-center cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="text-lg font-medium mb-2">{restaurant.name}</h3>
      <p className="text-gray-600 mb-1">📍 {restaurant.address}</p>
      <p className="text-gray-600">📞 {restaurant.phone}</p>
      <button 
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Menu
      </button>
    </div>
  );
}

export default RestaurantCard;