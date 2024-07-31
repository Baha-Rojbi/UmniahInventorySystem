import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShopPage = () => {
  const { shopId } = useParams();
  const [shopName, setShopName] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fromShopId, setFromShopId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAndItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized to view this page.');
        setLoading(false);
        return;
      }

      try {
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

        const itemsResponse = await fetch(`https://localhost:7238/api/items/shop/${shopId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items');
        }

        const itemsData = await itemsResponse.json();
        setItems(itemsData.$values || itemsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchShopAndItems();
  }, [shopId]);

  const handlePlaceOrderClick = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not authorized to view this page.');
      return;
    }

    try {
      const shopsResponse = await fetch(`https://localhost:7238/api/items/${item.itemCode}/shops`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!shopsResponse.ok) {
        throw new Error('Failed to fetch shops');
      }

      const shopsData = await shopsResponse.json();
      setShops(shopsData.$values || shopsData);
      setSelectedItem(item);
      setShowModal(true);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not authorized to place an order.');
      return;
    }
  
    try {
      const orderData = {
        itemID: selectedItem.serialNumber,
        fromShopId: parseInt(fromShopId, 10),
        toShopId: parseInt(shopId, 10),
        quantity: parseInt(quantity, 10),
      };
  
      const response = await fetch('https://localhost:7238/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to place order');
        } else {
          throw new Error('Failed to place order');
        }
      }
  
      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};
  
      setMessage('Order placed successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };
    
  
  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Shop: {shopName}</h2>
      {message && <div className="mb-4 text-red-500 text-center">{message}</div>}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Type</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Inventory Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handlePlaceOrderClick(item)}
                      className="py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    >
                      Place Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No items found.</div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Place Order</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="mb-4">
                <label className="block text-gray-700">Item</label>
                <input
                  type="text"
                  value={selectedItem.itemCode}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Select From Shop</label>
                <select
                  value={fromShopId}
                  onChange={(e) => setFromShopId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a shop</option>
                  {shops.map((shop) => (
                    <option key={shop.shopId} value={shop.shopId}>
                      {shop.shopName} (ID: {shop.shopId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2 px-4 bg-gray-500 hover:bg-gray-700 text-white rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
