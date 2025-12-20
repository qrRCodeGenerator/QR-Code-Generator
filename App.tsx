
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, User, Order, AppView } from './types';
import { PRODUCTS, CATEGORIES, MOCK_ORDERS } from './constants';
import { getSmartSuggestions } from './geminiService';

// --- Components ---

const Header: React.FC<{ 
  cartCount: number; 
  onCartOpen: () => void; 
  user: User | null; 
  onViewChange: (v: AppView) => void;
  onLogout: () => void;
}> = ({ cartCount, onCartOpen, user, onViewChange, onLogout }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <button onClick={() => onViewChange('home')} className="text-2xl font-black text-yellow-400 tracking-tighter">
          Blink<span className="text-gray-900">Fast</span>
        </button>
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Delivery in 10 minutes
          </span>
          <span className="text-[10px] text-gray-500 truncate w-40">Gurugram, Haryana, India</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onViewChange(user.role === 'admin' ? 'admin' : 'profile')}
              className="text-xs font-bold text-gray-700 hover:text-yellow-600 px-2 py-1"
            >
              {user.role === 'admin' ? 'Admin Dashboard' : `Hi, ${user.name.split(' ')[0]}`}
            </button>
            <button onClick={onLogout} className="text-[10px] text-red-500 font-bold">Logout</button>
          </div>
        ) : (
          <button 
            onClick={() => onViewChange('login')}
            className="text-sm font-bold text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            Login
          </button>
        )}
        <button 
          onClick={onCartOpen}
          className="bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-800 shadow-lg shadow-green-700/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && <span className="bg-white text-green-700 px-1.5 py-0.5 rounded text-[10px] leading-none">{cartCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

const AdminPanel: React.FC<{ products: Product[]; orders: Order[] }> = ({ products, orders }) => {
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-black mb-8">Admin Console</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Sales</p>
          <h2 className="text-3xl font-black mt-2 text-green-700">₹{totalSales}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Orders Received</p>
          <h2 className="text-3xl font-black mt-2 text-blue-700">{orders.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Product Inventory</p>
          <h2 className="text-3xl font-black mt-2 text-yellow-700">{products.length}</h2>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
            Recent Orders
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="text-sm">
                    <td className="px-6 py-4 font-mono font-bold text-gray-400">{o.id}</td>
                    <td className="px-6 py-4 font-bold">{o.userName}</td>
                    <td className="px-6 py-4 font-black">₹{o.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{o.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const CheckoutFlow: React.FC<{ 
  onBack: () => void; 
  onComplete: (address: string, method: string) => void;
  total: number;
}> = ({ onBack, onComplete, total }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('UPI');

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-black">Checkout</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full">
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s === 1 ? 'Address' : s === 2 ? 'Payment' : 'Review'}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-black mb-2">Where should we deliver?</h3>
            <p className="text-gray-500 text-sm mb-6">Enter your full address for accurate 10-min delivery.</p>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Street, Landmark, Area..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            />
            <button 
              disabled={!address.trim()}
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-yellow-400 text-gray-900 py-4 rounded-xl font-black disabled:opacity-50"
            >
              Confirm Address
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-2xl font-black mb-6">Select Payment</h3>
            {[
              { id: 'UPI', label: 'UPI (GPay, PhonePe)', icon: '📱' },
              { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
              { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => setPayment(method.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${payment === method.id ? 'border-green-700 bg-green-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-bold text-gray-800">{method.label}</span>
                </div>
                {payment === method.id && <div className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center text-white">✓</div>}
              </button>
            ))}
            <button 
              onClick={() => setStep(3)}
              className="w-full mt-8 bg-green-700 text-white py-4 rounded-xl font-black"
            >
              Continue to Review
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-2xl font-black">Final Review</h3>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery to:</span>
                <span className="font-bold text-right truncate w-40">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold">{payment}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-black">Total to pay:</span>
                <span className="font-black text-green-700">₹{total}</span>
              </div>
            </div>
            <button 
              onClick={() => onComplete(address, payment)}
              className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-black text-lg shadow-xl shadow-yellow-400/20"
            >
              Place Order Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget as any).email.value;
    const isAdmin = email.includes('admin');
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: isAdmin ? 'Admin User' : 'Standard User',
      email: email,
      role: isAdmin ? 'admin' : 'user'
    });
    setCurrentView('home');
  };

  const logout = () => {
    setUser(null);
    setCurrentView('home');
    setCart([]);
  };

  // Cart Management
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing?.quantity === 1) return prev.filter(item => item.id !== id);
      return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const handleCheckoutComplete = (address: string, payment: string) => {
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 900) + 100}`,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      items: [...cart],
      total,
      status: 'pending',
      timestamp: Date.now(),
      address,
      paymentMethod: payment
    };
    setOrders([newOrder, ...orders]);
    setOrderPlaced(true);
    setCart([]);
    setCurrentView('home');
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory) list = list.filter(p => p.category === activeCategory);
    if (matchedIds) list = list.filter(p => matchedIds.includes(p.id));
    else if (searchQuery && !isAiThinking) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [activeCategory, searchQuery, matchedIds, isAiThinking]);

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl animate-bounce">🛵</div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Ordering Excellence!</h2>
          <p className="text-gray-500 mt-2">Our partner is on the way. Arriving in 9 mins.</p>
        </div>
        <button onClick={() => setOrderPlaced(false)} className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold">Awesome</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onCartOpen={() => setIsCartOpen(true)} 
        user={user}
        onViewChange={setCurrentView}
        onLogout={logout}
      />

      {currentView === 'login' && (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Enter your details to start shopping.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email</label>
              <input name="email" type="email" required placeholder="name@example.com" className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-400" />
              <p className="text-[10px] text-gray-400 mt-1">Hint: use 'admin@fast.com' for admin dashboard access.</p>
            </div>
            <button className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-black text-lg">Sign In</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Don't have an account? <button onClick={() => setCurrentView('register')} className="text-yellow-600 font-bold">Sign Up</button></p>
        </div>
      )}

      {currentView === 'home' && (
        <main>
          <div className="bg-gradient-to-b from-yellow-50 to-white pb-12 pt-6">
             <div className="max-w-3xl mx-auto px-4 relative">
              <input
                type="text"
                placeholder="Search for 'milk', 'snacks' or 'pasta dinner'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-24 rounded-2xl border-none bg-white shadow-xl focus:ring-2 focus:ring-yellow-400 transition-all text-sm"
              />
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="mt-10 px-4 max-w-7xl mx-auto flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === 'all' ? null : cat.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${activeCategory === cat.id ? 'bg-yellow-100 scale-105 ring-1 ring-yellow-400' : 'bg-white grayscale hover:grayscale-0 shadow-sm'}`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-[10px] font-bold text-gray-700 w-16 text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-8 pb-20">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-700 rounded-full"></span>
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="h-32 mb-4 overflow-hidden rounded-xl">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold h-8 line-clamp-2">{p.name}</h3>
                    <p className="text-[10px] text-gray-400 mb-2">{p.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-sm">₹{p.price}</span>
                      <button 
                        onClick={() => addToCart(p)}
                        className="border border-green-700 text-green-700 px-4 py-1 rounded-lg text-xs font-bold hover:bg-green-700 hover:text-white transition-colors"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {currentView === 'admin' && <AdminPanel products={PRODUCTS} orders={orders} />}
      
      {currentView === 'checkout' && (
        <CheckoutFlow 
          onBack={() => setCurrentView('home')} 
          total={cart.reduce((s, i) => s + (i.price * i.quantity), 0)}
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full animate-slide-in flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-black">Shopping Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <span className="text-6xl">🛍️</span>
                  <p className="text-gray-400 font-bold">Your bag is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl items-center">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold">{item.name}</h4>
                      <p className="text-xs font-black mt-1">₹{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      <button onClick={() => removeFromCart(item.id)} className="font-bold text-green-700">-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="font-bold text-green-700">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-bold text-sm uppercase">Grand Total</span>
                  <span className="text-2xl font-black text-green-700">₹{cart.reduce((s, i) => s + (i.price * i.quantity), 0)}</span>
                </div>
                <button 
                  onClick={() => {
                    if (!user) setCurrentView('login');
                    else setCurrentView('checkout');
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-green-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-700/20 active:scale-95 transition-transform"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global CSS for animations */}
      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}
