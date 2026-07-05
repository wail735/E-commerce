import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import SearchContext from "../context/SearchContext";
import CardContext from "../context/CartContext";
const allProducts = [
  // Kids Wear
  {
    id: 1,
    title: "Kids Casual Shirt",
    price: 25,
    category: "kids-wear",
    img: "/assets/kids/kids_shirt.png",
    rating: 4,
    desc: "Comfortable everyday shirt for kids.",
  },
  {
    id: 2,
    title: "Boys Denim Jacket",
    price: 40,
    category: "kids-wear",
    img: "/assets/kids/kids_jacket.png",
    rating: 5,
    desc: "Trendy denim jacket for boys.",
  },
  {
    id: 3,
    title: "Girls Summer Dress",
    price: 30,
    category: "kids-wear",
    img: "/assets/kids/kids_dress.png",
    rating: 4,
    desc: "Bright and cheerful summer dress.",
  },
  {
    id: 14,
    title: "Kids Hoodie",
    price: 35,
    category: "kids-wear",
    img: "/assets/kids/kids_hoodie.png",
    rating: 4,
    desc: "Cozy hoodie for cool evenings.",
  },

  // Mens Wear
  {
    id: 4,
    title: "Men's Formal Shirt",
    price: 120,
    category: "mens-wear",
    img: "/assets/shirt/shirt.png",
    rating: 5,
    desc: "Classic formal shirt for the modern man.",
  },
  {
    id: 5,
    title: "Men's Casual Shirt",
    price: 20,
    category: "mens-wear",
    img: "/assets/shirt/shirt2.png",
    rating: 4,
    desc: "Easy-going casual shirt for any occasion.",
  },
  {
    id: 6,
    title: "Men's Summer Shirt",
    price: 45,
    category: "mens-wear",
    img: "/assets/shirt/shirt3.png",
    rating: 4,
    desc: "Light and breezy shirt for summer.",
  },
  {
    id: 15,
    title: "Men's Polo Shirt",
    price: 35,
    category: "mens-wear",
    img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80",
    rating: 4,
    desc: "Classic polo for a smart-casual look.",
  },

  // Electronics
  {
    id: 7,
    title: "Wireless Headphones",
    price: 80,
    category: "electronics",
    img: "/assets/electronics/headphones.png",
    rating: 5,
    desc: "Premium sound quality, all-day comfort.",
  },
  {
    id: 8,
    title: "Smartphone",
    price: 599,
    category: "electronics",
    img: "/assets/electronics/smartphone.png",
    rating: 4,
    desc: "Powerful smartphone for power users.",
  },
  {
    id: 9,
    title: "Smart Watch",
    price: 150,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    rating: 5,
    desc: "Track your fitness and stay connected.",
  },
  {
    id: 16,
    title: "Laptop",
    price: 999,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
    rating: 5,
    desc: "Ultra-thin, ultra-powerful laptop.",
  },

  // Top Rated
  {
    id: 10,
    title: "Women Ethnic Wear",
    price: 55,
    category: "top-rated",
    img: "/assets/women/women.png",
    rating: 5,
    desc: "Elegant ethnic wear for special occasions.",
  },
  {
    id: 11,
    title: "Women Stylish Top",
    price: 90,
    category: "top-rated",
    img: "/assets/women/women2.jpg",
    rating: 5,
    desc: "Stay stylish with this premium top.",
  },
  {
    id: 17,
    title: "Women Summer Dress",
    price: 60,
    category: "top-rated",
    img: "/assets/women/women3.jpg",
    rating: 5,
    desc: "Perfect for a sunny day out.",
  },
  {
    id: 18,
    title: "Women Party Wear",
    price: 75,
    category: "top-rated",
    img: "/assets/women/women4.jpg",
    rating: 5,
    desc: "Turn heads at your next party.",
  },

  // Trending
  {
    id: 12,
    title: "Trending Casual Wear",
    price: 25,
    category: "trending",
    img: "/assets/women/women3.jpg",
    rating: 4,
    desc: "What everyone is wearing this season.",
  },
  {
    id: 19,
    title: "Trending Sports Wear",
    price: 50,
    category: "trending",
    img: "https://images.unsplash.com/photo-1556906781-9a412961d28e?w=500&q=80",
    rating: 4,
    desc: "Sport the latest athleisure trend.",
  },

  // Best Selling
  {
    id: 13,
    title: "Best Selling Outfit",
    price: 65,
    category: "best-selling",
    img: "/assets/women/women4.jpg",
    rating: 5,
    desc: "Our #1 best seller. You'll see why!",
  },
  {
    id: 20,
    title: "Best Selling Shirt",
    price: 30,
    category: "best-selling",
    img: "/assets/shirt/shirt.png",
    rating: 5,
    desc: "Flying off the shelves for a reason.",
  },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [sortBy, setSortBy] = useState("default");

  const formattedTitle = categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Filter products by the current category
  let categoryProducts = allProducts.filter(
    (product) => product.category === categoryName,
  );

  // Sort products
  if (sortBy === "price-asc")
    categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")
    categoryProducts = [...categoryProducts].sort((a, b) => b.price - a.price);
  if (sortBy === "rating")
    categoryProducts = [...categoryProducts].sort(
      (a, b) => b.rating - a.rating,
    );
  const { searchQuery } = useContext(SearchContext);
  const { AddToCard } = useContext(CardContext);

  if (searchQuery) {
    categoryProducts = categoryProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

return (
    <div className="min-h-[60vh] dark:bg-gray-900 dark:text-white">
      {/* Category Banner */}
      <div className="bg-linear-to-r from-orange-400 to-orange-600 dark:from-gray-800 dark:to-gray-900 py-14 text-center text-white">
        <h1 className="text-5xl font-bold mb-3">{formattedTitle}</h1>
        <p className="text-orange-100 dark:text-gray-400 text-lg">
          Discover our exclusive {formattedTitle} collection
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 pb-20">
        {/* Sort bar */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-500 dark:text-gray-400">
            {categoryProducts.length} product
            {categoryProducts.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((data) => (
              <div
                key={data.id}
                className="rounded-2xl bg-white dark:bg-gray-800 hover:shadow-2xl shadow-md duration-300 group w-full overflow-hidden flex flex-col"
              >
                {/* Image — fixed height, consistent for ALL cards */}
                <div className="h-56 w-full bg-gray-50 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-full h-full object-contain group-hover:scale-110 duration-500 p-2"
                  />
                </div>
                {/* Details */}
                <div className="p-4 flex flex-col grow">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star text-xs ${i < data.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      ></i>
                    ))}
                  </div>
                  <h3 className="font-bold text-base leading-tight">
                    {data.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2 grow">
                    {data.desc}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-orange-500 font-bold text-xl">
                      ${data.price}
                    </span>
                    <button 
                      onClick={() => AddToCard(data)}
                      className="bg-orange-400 hover:bg-orange-500 text-white text-sm py-1.5 px-4 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <i className="fa-solid fa-box-open text-8xl mb-6 text-gray-200 dark:text-gray-700"></i>
            <h2 className="text-2xl font-semibold mb-2">No products yet</h2>
            <p className="text-gray-400">
              We're working on adding items to this category. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
