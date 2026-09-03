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
    const productId = product._id || product.id;
    setWishlistItems((prev) => {
      const exists = prev.find((item) => (item._id || item.id) === productId);
      if (exists) {
        return prev.filter((item) => (item._id || item.id) !== productId);
      } else {
        return [...prev, { ...product, id: productId }];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
