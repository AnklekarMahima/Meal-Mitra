import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] pt-[15vh] text-center font-sans">
      <h1 className="text-5xl text-gray-800 mb-2">🍽️ MealMitra</h1>
      <p className="text-xl text-gray-600 mb-8">Your companion for delicious meals!</p>
      <div className="space-x-4">
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button onClick={() => navigate("/register")}>Register</Button>
      </div>
    </div>
  );
}

const Button = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 text-white bg-blue-600 rounded-full transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </button>
);

export default LandingPage;