import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShopPage = () => {
  const { shopId } = useParams();
  const [shopName, setShopName] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchShopAndItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized to view this page.');
        return;
      }

      try {
        // Fetch shop details
        const shopResponse = await fetch(`https://localhost:7238/api/shops/${shopId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!shopResponse.ok) {
          throw new Error('Failed to fetch shop details');
        }

        const shopData = await shopResponse.json();
        setShopName(shopData.shopName);

        // Fetch items for the shop
        const itemsResponse = await fetch(`https://localhost:7238/api/items/shop/${shopId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items');
        }

        const itemsData = await itemsResponse.json();
        console.log('Fetched items:', itemsData); // Log response data

        // Handle the $values property if it exists
        const itemsArray = itemsData.$values || itemsData;
        setItems(itemsArray);
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchShopAndItems();
  }, [shopId]);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">Shop: {shopName}</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b bg-gray-100">Serial Number</th>
                <th className="py-2 px-4 border-b bg-gray-100">Item Code</th>
                <th className="py-2 px-4 border-b bg-gray-100">Item Type</th>
                <th className="py-2 px-4 border-b bg-gray-100">Sub Inventory Status</th>
                <th className="py-2 px-4 border-b bg-gray-100">Shop ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.serialNumber} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.serialNumber}</td>
                  <td className="py-2 px-4 border-b">{item.itemCode}</td>
                  <td className="py-2 px-4 border-b">{item.itemType}</td>
                  <td className="py-2 px-4 border-b">{item.subInventoryStatus}</td>
                  <td className="py-2 px-4 border-b">{item.shopId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No items found.</div>
      )}
    </div>
  );
};

export default ShopPage;
