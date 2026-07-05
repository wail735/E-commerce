import React from "react";

const ProductsData = [
  {
    id: 1,
    img: "./assets/shirt/shirt.png",
    title: "Casual Wear",
    description:
      "Discover the ultimate comfort and style with our casual wear collection. Perfect for your everyday adventures.",
  },
  {
    id: 2,
    img: "./assets/shirt/shirt2.png",
    title: "Printed shirt",
    description:
      "Make a statement with our vibrant printed shirts. Designed to stand out and keep you looking sharp.",
  },
  {
    id: 3,
    img: "./assets/shirt/shirt3.png",
    title: "Women shirt",
    description:
      "Elegant and versatile women's shirts crafted for any occasion. Feel confident and beautiful all day long.",
  },
];

const TopProducts = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-white duration-200 py-10">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-left mb-24">
          <p className="text-sm text-orange-400">Top Rated Products for you</p>
          <h1 className="text-3xl font-bold">Best Products</h1>
          <p className="text-xs text-gray-400">
            Explore our highest-rated items, handpicked for quality and loved by our amazing customers.
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-orange-400 hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
            >
              {/* image section */}
              <div className="h-[100px]">
                <img
                  src={data.img}
                  alt={data.title}
                  className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>
              {/* details section */}
              <div className="p-4 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1 mb-2">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <i className="fa-solid fa-star text-yellow-400"></i>
                </div>
                <h1 className="text-xl font-bold">{data.title}</h1>
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2 my-2">
                  {data.description}
                </p>
                <button className="bg-orange-400 hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-orange-400">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
