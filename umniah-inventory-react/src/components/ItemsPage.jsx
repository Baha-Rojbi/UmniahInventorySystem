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
        console.log('Fetching items from API...');
        const response = await fetch('https://localhost:7238/api/items', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch items');
        }

        const data = await response.json();
        const itemsArray = data.$values || [];
        console.log('Fetched items:', itemsArray);
        setItems(itemsArray);
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">All Shops Items</h2>
      {message && <div className="mb-4 text-red-500 text-center">{message}</div>}
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Type</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Inventory Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.serialNumber} className="hover:bg-gray-100">
                  <td className="py-4 px-6">{item.serialNumber}</td>
                  <td className="py-4 px-6">{item.itemCode}</td>
                  <td className="py-4 px-6">{item.itemType}</td>
                  <td className="py-4 px-6">{item.subInventoryStatus}</td>
                  <td className="py-4 px-6">{item.shopId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No items found.</div>
      )}
    </div>
  );
};

export default ItemsPage;
