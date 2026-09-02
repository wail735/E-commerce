import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { token, user } = useAuth();
    
    // Fallback local cart state
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("moexpress_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isSyncing, setIsSyncing] = useState(false);

    // Initial sync with backend
    useEffect(() => {
        if (token) {
            fetchBackendCart();
        } else {
            // Keep local cart
            const savedCart = localStorage.getItem("moexpress_cart");
            if (savedCart) setCartItems(JSON.parse(savedCart));
        }
    }, [token]);

    // Save to localStorage whenever cart changes (as fallback)
    useEffect(() => {
        localStorage.setItem("moexpress_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const fetchBackendCart = async () => {
        try {
            setIsSyncing(true);
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/v1/users/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // data.data is the cart array, but we need to format it to match our frontend structure
            // In user.model.js, cart has { product: ObjectId(populated?), quantity }
            if (data.data && Array.isArray(data.data)) {
                const formattedCart = data.data
                    .filter(item => item.product != null) // Ignorer les produits supprimés
                    .map(item => ({
                        ...item.product,
                        id: item.product._id || item.product.id,
                        quantity: item.quantity
                    }));
                setCartItems(formattedCart);
            }
        } catch (error) {
            console.error("Error fetching cart from backend", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const productId = product._id || product.id;
        
        // Optimistic UI update
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === productId);
            if (existingItem) {
                return prev.map(item => item.id === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
            }
            return [...prev, { ...product, id: productId, quantity }];
        });

        if (token) {
            try {
                await axios.post(import.meta.env.VITE_API_URL + "/api/v1/users/cart", 
                    { productId, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error adding to cart on backend", error);
                fetchBackendCart(); // Revert on failure
            }
        }
    };

    const removeFromCart = async (productId) => {
        // Optimistic update
        setCartItems(prev => prev.filter(item => item.id !== productId));

        if (token) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/users/cart/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Error removing from backend cart", error);
                fetchBackendCart();
            }
        }
    };

    const removeMultipleFromCart = async (productIds) => {
        setCartItems(prev => prev.filter(item => !productIds.includes(item.id)));
        
        if (token) {
            // Backend might not support multiple delete natively, loop sequentially or ignore
            for (const productId of productIds) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/users/cart/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {}
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        // Optimistic update
        setCartItems(prev => prev.map(item => item.id === productId
            ? { ...item, quantity }
            : item
        ));

        if (token) {
            try {
                await axios.put(import.meta.env.VITE_API_URL + "/api/v1/users/cart", 
                    { productId, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error updating cart quantity on backend", error);
                fetchBackendCart();
            }
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity, 0
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
            cartCount,
            isSyncing
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
