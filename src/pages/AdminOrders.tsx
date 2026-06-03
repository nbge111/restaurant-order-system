import { useState, useEffect } from 'react';
import { ChefHat, LogOut, RefreshCw, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types';

const statusConfig = {
  pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: '已确认', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  preparing: { label: '制作中', color: 'bg-orange-100 text-orange-700', icon: Clock },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/orders/stream`);
    eventSource.onmessage = () => {
      fetchOrders();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const data = await api.orders.getAll(status);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    if (!token) return;
    try {
      await api.orders.updateStatus(orderId, newStatus, token);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  };

  const filteredOrders = selectedStatus === 'all' ? orders : orders.filter(o => o.status === selectedStatus);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">订单管理</h1>
                <p className="text-sm text-gray-500">实时查看和处理订单</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                <p className="text-sm text-gray-500">待确认</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">{confirmedCount}</p>
                <p className="text-sm text-gray-500">已确认</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-500">{preparingCount}</p>
                <p className="text-sm text-gray-500">制作中</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">{completedCount}</p>
                <p className="text-sm text-gray-500">已完成</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'preparing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? '全部' : statusConfig[status as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchOrders}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无订单</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
              const nextStatus = getNextStatus(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-800">#{order.id}</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">桌号: {order.table_number}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                          <StatusIcon className="w-4 h-4 inline mr-1" />
                          {statusConfig[order.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">下单时间: {new Date(order.created_at).toLocaleString('zh-CN')}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                            <p className="text-sm font-semibold text-orange-500">¥{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">合计</p>
                      <p className="text-xl font-bold text-orange-500">¥{order.total_amount.toFixed(2)}</p>
                    </div>
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        {statusConfig[nextStatus as keyof typeof statusConfig].label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
