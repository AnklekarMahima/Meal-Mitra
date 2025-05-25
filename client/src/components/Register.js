import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      alert(data.message);
      if (["User registered", "Login successful"].includes(data.message)) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Registration failed");
    }
  };

  const inputClasses = "w-full p-2.5 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const buttonClasses = "w-full py-2.5 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors";

  return (
    <div className="max-w-md mx-auto my-12 p-6 border-2 border-blue-500 rounded-xl bg-orange-50 shadow-lg text-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "phone", "address_line", "city", "state", "pincode"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.replace("_", " ").toUpperCase()}
            required
            className={inputClasses}
          />
        ))}
        <button type="submit" className={buttonClasses}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;