import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("moexpress_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("moexpress_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item => item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const removeMultipleFromCart = (productIds) => {
        setCartItems(prev => prev.filter(item => !productIds.includes(item.id)));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev => prev.map(item => item.id === productId
            ? { ...item, quantity }
            : item
        ));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const cartCount = cartItems.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            removeMultipleFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
