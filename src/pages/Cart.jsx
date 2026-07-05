import React, { useContext } from "react";
import CardContext from "../context/CartContext";

const Cart = () => {
  const { cardItem, removeFromCard, updateQuantity } = useContext(CardContext);

  const subtotal = cardItem.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="py-14 min-h-[60vh] dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cardItem.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
             <i className="fa-solid fa-cart-shopping text-6xl mb-4 text-gray-300 dark:text-gray-700"></i>
             <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
             <p>Looks like you haven't added anything to your cart yet.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cardItem.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border dark:border-gray-700 p-4 rounded-lg shadow-sm">
                <img src={item.img} alt={item.title} className="w-24 h-24 object-contain rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">+</button>
                </div>
                <button onClick={() => removeFromCard(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded cursor-pointer transition-colors">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 border-b dark:border-gray-700 pb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t dark:border-gray-700 pt-2 mb-6">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold transition-colors duration-200 cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
