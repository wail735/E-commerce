import React from "react";

const ProductsData = [
  {
    id: 1,
    img: "./assets/women/women.png",
    title: "Women Ethnic",
    rating: 5.0,
    color: "White",
    aosDelay: "0",
  },
  {
    id: 2,
    img: "./assets/women/women2.jpg",
    title: "Women western",
    rating: 4.5,
    color: "Red",
    aosDelay: "200",
  },
  {
    id: 3,
    img: "./assets/women/women3.jpg",
    title: "Goggles",
    rating: 4.7,
    color: "brown",
    aosDelay: "400",
  },
  {
    id: 4,
    img: "./assets/women/women4.jpg",
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
    aosDelay: "600",
  },
  {
    id: 5,
    img: "./assets/women/women2.jpg",
    title: "Fashion T-Shirt",
    rating: 4.5,
    color: "Pink",
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12 dark:bg-gray-900 dark:text-white duration-200">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-orange-400">Top Selling Products for you</p>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-xs text-gray-400">
            Browse our curated selection of trending and best-selling items. Find your new favorites today.
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                key={data.id}
                className="space-y-3 cursor-pointer group"
              >
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[220px] w-[150px] object-cover rounded-md group-hover:scale-105 duration-300 shadow-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{data.color}</p>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span>{data.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center mt-10">
            <button className="text-center mt-10 cursor-pointer bg-orange-400 text-white py-1 px-5 rounded-md hover:bg-orange-500 duration-200">
              View All Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
