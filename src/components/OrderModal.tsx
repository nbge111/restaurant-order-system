import { CheckCircle, X, Clock, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { api } from '../services/api';
import { useState } from 'react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { items, getTotal, tableNumber, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmitOrder = async () => {
    if (!tableNumber || items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderItems = items.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      }));
      
      await api.orders.create(tableNumber, orderItems);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('下单失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {orderSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">下单成功!</h2>
            <p className="text-gray-500 mb-6">您的订单已提交，厨房正在准备</p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              继续点餐
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">确认订单</h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>桌号: <strong className="text-gray-800">{tableNumber}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{new Date().toLocaleString('zh-CN')}</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.menu_item_id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">¥{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-800">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">合计</span>
                  <span className="text-2xl font-bold text-orange-500">¥{getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : '确认下单'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
