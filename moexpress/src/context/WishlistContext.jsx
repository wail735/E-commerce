import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const item = window.localStorage.getItem('moexpress_wishlist');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('moexpress_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
