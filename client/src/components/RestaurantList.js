import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import RestaurantCard from './RestaurantCard';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);
 
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold m-0">Available Restaurants</h2>
        <button 
          onClick={() => navigate("/orders")}
          className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Your Orders
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

export default RestaurantList;