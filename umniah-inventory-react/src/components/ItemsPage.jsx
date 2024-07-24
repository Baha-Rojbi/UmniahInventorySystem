import React, { useEffect, useState } from 'react';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized to view this page.');
        return;
      }

      try {
        console.log('Fetching items from API...'); // Log request start
        const response = await fetch('https://localhost:7238/api/items', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Log response status

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch items');
        }

        const data = await response.json();
        const itemsArray = data.$values || [];
        console.log('Fetched items:', itemsArray); // Log response data
        setItems(itemsArray);
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Items</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      {items.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Serial Number</th>
              <th className="py-2 px-4 border-b">Item Code</th>
              <th className="py-2 px-4 border-b">Item Type</th>
              <th className="py-2 px-4 border-b">Sub Inventory Status</th>
              <th className="py-2 px-4 border-b">Shop ID</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.serialNumber}>
                <td className="py-2 px-4 border-b">{item.serialNumber}</td>
                <td className="py-2 px-4 border-b">{item.itemCode}</td>
                <td className="py-2 px-4 border-b">{item.itemType}</td>
                <td className="py-2 px-4 border-b">{item.subInventoryStatus}</td>
                <td className="py-2 px-4 border-b">{item.shopId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No items found.</div>
      )}
    </div>
  );
};

export default ItemsPage;
