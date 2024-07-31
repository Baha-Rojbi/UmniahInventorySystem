import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UmniahLogo from '../assests/images/Umniah.jpg'; // Adjust the path as needed

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={UmniahLogo} alt="Umniah Logo" className="w-10 h-10 mr-4" />
          <Link to="/items" className="text-white px-3 py-2 rounded-md text-sm font-medium">Items</Link>
          <Link to="/shop-items/1" className="text-white px-3 py-2 rounded-md text-sm font-medium">Shop Items</Link>
          <Link to="/admin-orders" className="text-white px-3 py-2 rounded-md text-sm font-medium">Orders</Link>
        </div>
        <button onClick={handleSignout} className="text-white px-3 py-2 rounded-md text-sm font-medium">Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
