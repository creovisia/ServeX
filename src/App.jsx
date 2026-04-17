import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, ChefHat, Globe } from 'lucide-react';

// Mock menu data
const menuItems = [
  {
    id: 1,
    name: { en: 'Masala Dosa', ta: 'மசாலா தோசை' },
    description: { en: 'Crispy rice crepe with spiced potato filling', ta: 'மசாலா உருளைக்கிழங்குடன் கூடிய மிருதுவான தோசை' },
    price: 120,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80',
    popular: true
  },
  {
    id: 2,
    name: { en: 'Idli Sambar', ta: 'இட்லி சாம்பார்' },
    description: { en: 'Steamed rice cakes with lentil curry', ta: 'பருப்பு குழம்புடன் சூடான இட்லி' },
    price: 80,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80',
    popular: true
  },
  {
    id: 3,
    name: { en: 'Paneer Butter Masala', ta: 'பன்னீர் பட்டர் மசாலா' },
    description: { en: 'Cottage cheese in rich tomato cream sauce', ta: 'தக்காளி கிரீம் சாஸில் பன்னீர்' },
    price: 220,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
    popular: false
  },
  {
    id: 4,
    name: { en: 'Vegetable Biryani', ta: 'காய்கறி பிரியாணி' },
    description: { en: 'Aromatic basmati rice with mixed vegetables', ta: 'கலவை காய்கறிகளுடன் பாசுமதி அரிசி' },
    price: 180,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    popular: false
  },
  {
    id: 5,
    name: { en: 'Chole Bhature', ta: 'சோலே பதூரே' },
    description: { en: 'Spicy chickpeas with fluffy fried bread', ta: 'காரமான கொண்டைக்கடலை மற்றும் பஜ்ஜி' },
    price: 150,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80',
    popular: false
  },
  {
    id: 6,
    name: { en: 'South Indian Thali', ta: 'தென்னிந்திய தாளி' },
    description: { en: 'Complete meal with rice, curries, and sides', ta: 'அரிசி, குழம்பு மற்றும் பக்க உணவுகள்' },
    price: 250,
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=500&q=80',
    popular: true
  },
  {
    id: 7,
    name: { en: 'Pav Bhaji', ta: 'பாவ் பாஜி' },
    description: { en: 'Spicy mashed vegetables with buttered buns', ta: 'காரமான காய்கறிகளுடன் பாவ்' },
    price: 130,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80',
    popular: false
  },
  {
    id: 8,
    name: { en: 'Rava Dosa', ta: 'ரவா தோசை' },
    description: { en: 'Crispy semolina crepe with herbs', ta: 'மூலிகைகளுடன் மொறுமொறுப்பான ரவை தோசை' },
    price: 110,
    image: 'https://images.unsplash.com/photo-1694672389333-0c3220b4e6b7?w=500&q=80',
    popular: false
  },
  {
    id: 9,
    name: { en: 'Palak Paneer', ta: 'பாலக் பன்னீர்' },
    description: { en: 'Cottage cheese in spinach gravy', ta: 'கீரை குழம்பில் பன்னீர்' },
    price: 200,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    popular: false
  },
  {
    id: 10,
    name: { en: 'Vada Sambar', ta: 'வடை சாம்பார்' },
    description: { en: 'Crispy lentil fritters with lentil curry', ta: 'பருப்பு குழம்புடன் வடை' },
    price: 90,
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&q=80',
    popular: false
  }
];

function App() {
  const [language, setLanguage] = useState('en');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      );
      return updatedCart.filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!tableNumber || isNaN(tableNumber)) {
      alert('Please enter a valid table number');
      return;
    }
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setShowCart(false);
      setOrderSuccess(false);
      setTableNumber('');
      setSpecialInstructions('');
    }, 2000);
  };

  const popularItems = menuItems.filter(item => item.popular);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Saravana Bhavan
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-orange-600 font-semibold border-b-2 border-orange-600 pb-1">
                Menu
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
                My Orders
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
                Contact
              </a>
            </nav>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(lang => lang === 'en' ? 'ta' : 'en')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 active:scale-95 transition-all duration-200"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </motion.header>

         {/* Recommended Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {language === 'en' ? 'Recommended for You' : 'உங்களுக்கு பரிந்துரைக்கப்படுகிறது'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.name[language]}</h4>
                    <p className="text-orange-600 font-semibold">₹{item.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Our Menu' : 'எங்கள் உணவு பட்டியல்'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'en' ? 'Authentic South Indian Cuisine' : 'உண்மையான தென்னிந்திய உணவு'}
          </p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Item Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name[language]}
                  className="w-full h-full object-cover"
                />
                {item.popular && (
                  <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {language === 'en' ? 'Popular' : 'பிரபலமான'}
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.name[language]}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description[language]}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{item.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item)}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-semibold shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-95 transition-all duration-200"
                  >
                    {language === 'en' ? 'Add' : 'சேர்க்க'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
</main>
     
      {/* Cart Summary Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {totalItems}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? 'Total' : 'மொத்தம்'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalPrice}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCart(true)}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{language === 'en' ? 'View Cart' : 'கூடை காண்க'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Cart Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'Your Cart' : 'உங்கள் கூடை'}
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                      <img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.name[language]}</h4>
                        <p className="text-orange-600 font-semibold">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-150"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-150"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Table Number' : 'மேசை எண்'}
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder={language === 'en' ? 'Enter table number' : 'மேசை எண்ணை உள்ளிடவும்'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'en' ? 'Special Instructions (Optional)' : 'சிறப்பு குறிப்புகள் (விரும்பினால்)'}
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder={language === 'en' ? 'Any special requests?' : 'ஏதேனும் சிறப்பு கோரிக்கைகள்?'}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Total and Submit */}
                  <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-700">
                        {language === 'en' ? 'Total Items:' : 'மொத்த பொருட்கள்:'}
                      </span>
                      <span className="font-bold text-gray-900">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl border-t border-orange-200 pt-3">
                      <span className="font-bold text-gray-900">
                        {language === 'en' ? 'Total:' : 'மொத்தம்:'}
                      </span>
                      <span className="font-bold text-orange-600">₹{totalPrice}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-95 transition-all duration-200"
                  >
                    {language === 'en' ? 'Place Order' : 'ஆர்டர் செய்க'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Success Message */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md mx-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Order Placed!' : 'ஆர்டர் வெற்றிகரமாக!'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Your order will be ready soon.' : 'உங்கள் ஆர்டர் விரைவில் தயாராகும்.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
