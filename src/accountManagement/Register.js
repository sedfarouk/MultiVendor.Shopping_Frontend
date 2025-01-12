import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Buyer');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://multivendorsystem-account-service.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phone,
          role
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      navigate('/login');
    } catch (error) {
      setError(error.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Left Side - Image or Graphic */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/800x600/?nature,water)' }}>
        <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
          <h1 className="text-white text-4xl font-bold tracking-wide text-center">Join MultiVendorApp</h1>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Sign Up</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Create your account and start shopping!</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600">Role</label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              Register
            </button>
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;