import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized to view this page.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://localhost:7238/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.$values || data);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleApprove = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not authorized to perform this action.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7238/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve order');
      }

      setMessage('Order approved successfully!');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderId ? { ...order, status: 1 } : order
        )
      );
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleTransfer = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not authorized to perform this action.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7238/api/orders/${orderId}/transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to transfer order');
      }

      setMessage('Order transferred successfully!');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderId ? { ...order, status: 2 } : order
        )
      );
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">All Orders</h2>
      {message && <div className="mb-4 text-red-500 text-center">{message}</div>}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Shop ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Shop ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.orderID} className="hover:bg-gray-100">
                  <td className="py-4 px-6">{order.orderID}</td>
                  <td className="py-4 px-6">{order.itemID}</td>
                  <td className="py-4 px-6">{order.fromShopId}</td>
                  <td className="py-4 px-6">{order.toShopId}</td>
                  <td className="py-4 px-6">{order.quantity}</td>
                  <td className="py-4 px-6">{new Date(order.requestDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6">{order.status}</td>
                  <td className="py-4 px-6">
                    {order.status === 0 && ( // Requested
                      <>
                        <button
                          onClick={() => handleApprove(order.orderID)}
                          className="py-1 px-3 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTransfer(order.orderID)}
                          className="py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
                        >
                          Transfer
                        </button>
                      </>
                    )}
                    {order.status === 1 && ( // Approved
                      <button
                        onClick={() => handleTransfer(order.orderID)}
                        className="py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
                      >
                        Transfer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No orders found.</div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
