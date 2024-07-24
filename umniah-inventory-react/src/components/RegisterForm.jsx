import React, { useState } from 'react';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopId, setShopId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7238/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, shopId }),
      });

      if (!response.ok) {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        } else {
          throw new Error('Unexpected response format');
        }
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setMessage('Registration successful!');
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Shop ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-md" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
