import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UmniahLogo from '../assests/images/Umniah.jpg'; // Adjust the path as needed

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://localhost:7238/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      setMessage('Login successful!');
      setLoading(false);

      // Decode the token to check for roles
      const base64Url = data.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);

      // Check if the user has the "Admin" role
      if (payload.role && payload.role.includes('Admin')) {
        navigate('/admin-orders');
      } else {
        navigate('/items');
      }
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xs mx-auto">
        <div className="px-8 py-6 mt-4 text-left bg-white rounded-xl shadow-lg">
          <div className="flex flex-col justify-center items-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <img src={UmniahLogo} alt="Umniah Logo" className="w-16" />
              <p className="m-0 text-[16px] font-semibold">Login to a Shop</p>
              <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                Get started with our app, just start section and enjoy experience.
              </span>
            </div>
            {message && <div className="mb-4 text-red-500">{message}</div>}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400">Password</label>
                <input
                  type="password"
                  className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
