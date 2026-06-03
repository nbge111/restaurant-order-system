import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Smartphone, ArrowUpRight, CheckCircle } from 'lucide-react';

export default function QRCodeDisplay() {
  const [localIp, setLocalIp] = useState('loading...');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    getLocalIP();
  }, []);

  const getLocalIP = async () => {
    try {
      // 使用WebRTC获取本地IP
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      pc.onicecandidate = (ice) => {
        if (ice.candidate && ice.candidate.candidate) {
          const ipRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/;
          const match = ice.candidate.candidate.match(ipRegex);
          if (match && match[0]) {
            setLocalIp(match[0]);
          } else {
            setLocalIp('192.168.1.100');
          }
          pc.close();
        }
      };
      
      setTimeout(() => {
        pc.close();
      }, 3000);
    } catch (error) {
      setLocalIp('192.168.1.100');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const frontendUrl = `http://${localIp}:5173`;
  const adminUrl = `http://${localIp}:5173/admin/login`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ 美味餐厅扫码点餐</h1>
          <p className="text-gray-600">扫描下方二维码访问</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 客人端 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">客人点餐</h2>
                <p className="text-sm text-gray-500">客人扫码下单</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-4">
                <QRCodeSVG value={frontendUrl} size={200} level="H" />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-3">
                  <code className="flex-1 text-sm text-gray-700 break-all">{frontendUrl}</code>
                  <button
                    onClick={() => copyToClipboard(frontendUrl)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {isCopied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
                <a
                  href={frontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  在新窗口打开
                </a>
              </div>
            </div>
          </div>

          {/* 商家端 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">商家管理</h2>
                <p className="text-sm text-gray-500">商家查看订单</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-4">
                <QRCodeSVG value={adminUrl} size={200} level="H" />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-3">
                  <code className="flex-1 text-sm text-gray-700 break-all">{adminUrl}</code>
                  <button
                    onClick={() => copyToClipboard(adminUrl)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {isCopied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
                <a
                  href={adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                >
                  在新窗口打开
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            如何使用
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-semibold text-orange-800 mb-2">📱 1. 客人点餐</h4>
              <p className="text-sm text-orange-700">客人用手机扫描第一个二维码，即可开始点餐</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4">
              <h4 className="font-semibold text-teal-800 mb-2">💼 2. 商家管理</h4>
              <p className="text-sm text-teal-700">商家扫描第二个二维码管理订单</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-2">📋 3. 实时同步</h4>
              <p className="text-sm text-purple-700">订单会实时同步，商家可以及时看到</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>注意：</strong> 确保您的手机和电脑在同一个Wi-Fi网络下，手机才能正常访问。如果无法扫描二维码，可以手动输入网址。
            </p>
            <p className="text-sm text-gray-500 mt-2">
              默认商家账号：<code className="bg-gray-200 px-1 rounded">admin</code> / <code className="bg-gray-200 px-1 rounded">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}