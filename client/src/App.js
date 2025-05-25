//to run, npm start
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import RestaurantList from './components/RestaurantList';
import LoginForm from "./components/LoginForm";
import RestaurantMenu from './components/RestaurantMenu';
import MakePayment from "./components/MakePayment";
import OrderHistory from './components/OrderHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id/menu" element={<RestaurantMenu />} />
        <Route path="/makepayment/:orderId" element={<MakePayment />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
