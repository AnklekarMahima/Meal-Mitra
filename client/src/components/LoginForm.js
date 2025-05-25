import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const { data: { user, message, address } } = await api.post('/auth/login', formData);
      setStatus(message || 'Login successful');

      if (message === 'User registered') {
        navigate('/register', { state: { user } });
      } else if (message === 'Login successful') {
        onLogin?.(user);
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('user_name', user.name);
        address?.address_id && localStorage.setItem('address_id', address.address_id);
        navigate('/restaurants');
      }
    } catch {
      setStatus('Login failed. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const buttonClasses = "w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-md mx-auto my-12 p-5 border-2 border-blue-500 rounded-xl bg-orange-50 shadow-lg text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Login to MealMitra</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={inputClasses} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className={inputClasses} />
        <button type="submit" disabled={loading} className={buttonClasses}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {status && <p className="mt-4 text-blue-600">{status}</p>}
    </div>
  );
};

export default LoginForm;