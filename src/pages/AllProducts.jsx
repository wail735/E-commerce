import React from "react";
import Products from "../components/Products";
import TopProducts from "../components/TopProducts";

const AllProducts = () => {
  return (
    <div className="pt-14 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">All Our Products</h1>
        <p className="text-gray-500">
          Browse through our extensive collection of high-quality products.
        </p>
      </div>
      <TopProducts />
      <Products />
    </div>
  );
};

export default AllProducts;
