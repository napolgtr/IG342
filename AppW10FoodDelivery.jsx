import React, { useState, useEffect } from 'react';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'พิซซ่ามาร์เกริต้า',
    price: 250,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&q=80&w=800',
    description: 'พิซซ่าคลาสสิก ซอสมะเขือเทศและมอสซาเรลล่าชีส'
  },
  {
    id: 2,
    name: 'ดับเบิ้ลชีสเบอร์เกอร์',
    price: 180,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    description: 'เบอร์เกอร์เนื้อสองชิ้นจัดเต็ม พร้อมเชดดาร์ชีสเยิ้มๆ'
  },
  {
    id: 3,
    name: 'ผัดไทยกุ้งสด',
    price: 80,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=800',
    description: 'เส้นจันท์ผัดซอสเข้มข้น หอมกลิ่นถั่วลิสงคั่ว'
  },
  {
    id: 4,
    name: 'ซูชิเซ็ตพรีเมียม',
    price: 350,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    description: 'รวมซูชิหน้าต่างๆ และโรลสดใหม่'
  },
  {
    id: 5,
    name: 'ซีซาร์สลัด',
    price: 120,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    description: 'ผักกาดคอสกรอบๆ คลุกเคล้าพาร์เมซานชีสและเบคอนกรอบ'
  },
  {
    id: 6,
    name: 'ข้าวหน้าไก่ทอด',
    price: 95,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    description: 'ไก่ทอดกรอบชิ้นโต เสิร์ฟบนข้าวสวยร้อนๆ'
  },
];

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodApp_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('foodApp_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [activeTab, setActiveTab] = useState('menu');
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodApp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('foodApp_history', JSON.stringify(history));
  }, [history]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) return { ...item, qty: item.qty + delta };
          return item;
        })
        .filter((item) => item.qty > 0);
    });
    if (cart.length === 1 && cart[0].qty + delta === 0) {
      setIsPaymentStep(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setIsPaymentStep(false);
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    setIsPaymentStep(true);
  };

  const handleConfirmPayment = () => {
    setShowSuccessPopup(true);
  };

  const handleClosePopupAndFinish = () => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString('th-TH'),
      items: [...cart],
      total: cartTotal
    };

    setHistory((prev) => [newOrder, ...prev]);
    clearCart();
    setShowSuccessPopup(false);
    setActiveTab('history');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'cart') {
      setIsPaymentStep(false);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MENU_ITEMS.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-48 w-full object-cover"
          />
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 text-sm flex-grow mt-1 mb-4">{item.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-lg text-[#00B900]">฿{item.price.toLocaleString()}</span>
              <button
                onClick={() => addToCart(item)}
                className="bg-[#00B900] hover:bg-[#009900] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCart = () => {
    if (isPaymentStep) {
      return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto text-center relative">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">สแกนเพื่อชำระเงิน</h2>
          <p className="text-gray-500 mb-6">ยอดรวมที่ต้องชำระ: <span className="font-bold text-[#00B900] text-xl">฿{cartTotal.toLocaleString()}</span></p>

          <div className="bg-gray-50 p-6 rounded-2xl inline-block border border-gray-200 mb-8">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PaymentForOrder${Date.now()}`}
              alt="QR Code สำหรับชำระเงิน"
              className="w-48 h-48 mx-auto"
            />
            <p className="text-sm text-gray-400 mt-4">พร้อมเพย์ / Mobile Banking</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              className="w-full bg-[#00B900] hover:bg-[#009900] text-white py-3 rounded-lg font-bold text-lg transition-colors shadow-sm"
            >
              ชำระเงินเรียบร้อย
            </button>
            <button
              onClick={() => setIsPaymentStep(false)}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 py-3 rounded-lg font-bold transition-colors"
            >
              ย้อนกลับไปแก้ไขตะกร้า
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">ตะกร้าสินค้าของคุณ</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">ตะกร้าของคุณยังว่างเปล่า มาสั่งอาหารกันเถอะ!</div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-gray-500 text-sm">฿{item.price.toLocaleString()} / ชิ้น</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l-lg">-</button>
                    <span className="px-3 font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-lg">+</button>
                  </div>
                  <span className="font-bold text-gray-800 w-20 text-right">
                    ฿{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">ยอดรวมทั้งสิ้น:</span>
              <span className="text-2xl font-bold text-[#00B900]">฿{cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="w-full mt-6 bg-[#00B900] hover:bg-[#009900] text-white py-3 rounded-lg font-bold text-lg transition-colors"
            >
              ดำเนินการชำระเงิน
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ประวัติการสั่งซื้อ</h2>
      {history.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
          ยังไม่มีประวัติการสั่งซื้อ
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                <span className="text-gray-500 text-sm">หมายเลขคำสั่งซื้อ #{order.id}</span>
                <span className="text-gray-500 text-sm">{order.date}</span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                      <span>{item.qty}x {item.name}</span>
                    </div>
                    <span>฿{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-800">สถานะ: <span className="text-[#00B900] font-normal">จัดส่งสำเร็จ</span></span>
                <span className="font-bold text-[#00B900]">ยอดรวม ฿{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12 relative">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1
            onClick={() => handleTabChange('menu')}
            className="text-2xl font-black text-[#00B900] tracking-tight cursor-pointer"
          >
            DPU Delivery
          </h1>
          <nav className="flex space-x-2">
            <button
              onClick={() => handleTabChange('menu')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'menu' ? 'bg-[#e6f8e6] text-[#00B900]' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              เมนูอาหาร
            </button>
            <button
              onClick={() => handleTabChange('cart')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${activeTab === 'cart' ? 'bg-[#e6f8e6] text-[#00B900]' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span>ตะกร้า</span>
              {cartItemCount > 0 && (
                <span className="bg-[#00B900] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'history' ? 'bg-[#e6f8e6] text-[#00B900]' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              ประวัติ
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'menu' && renderMenu()}
        {activeTab === 'cart' && renderCart()}
        {activeTab === 'history' && renderHistory()}
      </main>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center transform transition-all scale-100">
            <div className="text-7xl mb-4 animate-bounce">🛵</div>

            <h3 className="text-2xl font-bold text-[#00B900] mb-2">ชำระเงินสำเร็จ!</h3>
            <p className="text-gray-600 mb-8">Raider กำลังเดินทางไปส่งอาหารให้คุณ<br />กรุณารอรับสายโทรศัพท์</p>

            <button
              onClick={handleClosePopupAndFinish}
              className="w-full bg-[#00B900] hover:bg-[#009900] text-white py-3 rounded-lg font-bold text-lg transition-colors shadow-sm"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}