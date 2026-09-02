import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Minus, Plus, Heart, ShoppingBag, Trash2 } from "lucide-react";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, removeMultipleFromCart, cartTotal, cartCount } = useCart();
  const { t } = useLanguage();
  const [selectedItems, setSelectedItems] = useState([]);

  // Calculate discount (example fixed or logic based)
  const discount = 5.00; 
  const subtotal = cartTotal;
  const shipping = cartTotal > 50 ? 0 : 5.00;
  const finalTotal = subtotal + shipping - (cartTotal > 0 ? discount : 0);

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const toggleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-[#0B1120] px-4 transition-colors duration-300">
        <div className="w-24 h-24 bg-orange-50 dark:bg-gray-800 text-[#FF4D20] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('empty_cart')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
          {t('cart_empty_desc')}
        </p>
        <Link
          to="/"
          className="bg-[#FF4D20] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          {t('start_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] py-8 lg:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">
          {t('my_cart')} ({cartCount})
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* CART ITEMS LIST */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#FF4D20] cursor-pointer"
                  checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('select_all')}</span>
              </div>
              
              {selectedItems.length > 0 && (
                <button 
                  onClick={() => {
                    removeMultipleFromCart(selectedItems);
                    setSelectedItems([]);
                  }}
                  className="text-sm text-red-500 font-medium hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={16} /> {t('delete_selected')}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Checkbox */}
                  <div className="pt-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#FF4D20] cursor-pointer"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelect(item.id)}
                    />
                  </div>

                  {/* Image */}
                  <Link to={`/product/${item._id || item.slug || item.id}`} className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F7F7F8] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    <img src={item.image || item.images?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.name || "Product"} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform p-2" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/product/${item._id || item.slug || item.id}`} className="text-[15px] font-bold text-gray-900 dark:text-gray-100 hover:text-[#FF4D20] dark:hover:text-[#FF4D20] transition-colors mb-0.5 line-clamp-1">
                          {item.name ? t(item.name) : (item.slug ? t(`prod_${item.slug.replace(/-/g, '_')}`) : "Product Name")}
                        </Link>
                        <p className="text-[13px] text-gray-400 mb-4">{t('color')}: Black</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                          <Heart size={20} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          title={t('remove_item')}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-8 bg-white dark:bg-gray-800">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors border-r border-gray-200 dark:border-gray-600"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center text-[13px] font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors border-l border-gray-200 dark:border-gray-600"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link to="/" className="inline-block px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {t('continue_shopping')}
              </Link>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-[#F8F9FA] dark:bg-gray-800/50 p-6 rounded-2xl sticky top-28 border border-transparent dark:border-gray-700">
              <h2 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">{t('order_summary')}</h2>
              
              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('subtotal')} ({cartCount} {t('items')})</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('shipping')}</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-[#00B578]">{t('free')}</span>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('discount')}</span>
                  <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">{t('total')}</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-[#FF4D20] text-white py-3.5 rounded-xl font-bold text-[15px] hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                {t('proceed_to_checkout')}
              </Link>
              
              <div className="mt-6">
                <p className="text-[13px] text-gray-500 mb-3 text-center">{t('we_accept')}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 flex items-center justify-center">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-4 object-contain" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 flex items-center justify-center">
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-4 object-contain" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 flex items-center justify-center">
                    <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-4 object-contain" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 flex items-center justify-center">
                    <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="Maestro" className="h-4 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;
