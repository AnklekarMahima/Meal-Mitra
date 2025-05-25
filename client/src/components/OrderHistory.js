import React, { useEffect, useState } from 'react';
import api from '../api';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantNames, setRestaurantNames] = useState({});
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [deliveryStatuses, setDeliveryStatuses] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/user/${userId}`);
        const fetchedOrders = res.data;
        setOrders(fetchedOrders);

        const restaurantMap = {};
        const paymentMap = {};
        const deliveryMap = {};

        for (const order of fetchedOrders) {
          try {
            const restaurantRes = await api.get(`/restaurants/${order.restaurant_id}`);
            restaurantMap[order.order_id] = restaurantRes.data.name;

            const paymentRes = await api.get(`/payments/${order.order_id}`);
            paymentMap[order.order_id] = paymentRes.data ? paymentRes.data.payment_status : 'Payment details not available';
          } catch (err) {
            restaurantMap[order.order_id] = 'Unknown';
            paymentMap[order.order_id] = 'Payment details not available';
          }

          try {
            const deliveryRes = await api.get(`/delivery/${order.order_id}`);
            deliveryMap[order.order_id] = deliveryRes.data ? deliveryRes.data.delivery_status : 'Delivery details not available';
          } catch (err) {
            deliveryMap[order.order_id] = 'Delivery details not available';
          }
        }

        setRestaurantNames(restaurantMap);
        setPaymentStatuses(paymentMap);
        setDeliveryStatuses(deliveryMap);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, []);
 
  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  const description="text-base text-gray-700"

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Order History</h2>
      <div className="flex flex-col gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1"
            >
              <p className={description}><strong className="text-gray-900">Order ID:</strong> {order.order_id}</p>
              <p className={description}><strong className="text-gray-900">Restaurant Name:</strong> {restaurantNames[order.order_id] || 'Loading...'}</p>
              <p className={description}><strong className="text-gray-900">Total Amount:</strong> ${order.total_amount}</p>
              <p className={description}><strong className="text-gray-900">Order Date:</strong> {order.order_date}</p>
              <p className={description}>
                <strong className="text-gray-900">Payment Status:</strong>{' '}
                <span className={paymentStatuses[order.order_id] === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {paymentStatuses[order.order_id] || 'Loading...'}
                </span>
              </p>
              <p className="text-base text-gray-700">
                <strong className="text-gray-900">Delivery Status:</strong>{' '}
                <span className={deliveryStatuses[order.order_id] === 'Delivered' ? 'text-blue-600 font-semibold' : 'text-rose-500 font-semibold'}>
                  {deliveryStatuses[order.order_id] || 'Loading...'}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;