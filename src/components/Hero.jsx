function HeroSection() {
  return (
    <div className="relative overflow-hidden min-h-137.5 sm:min-h-162.5 bg-gray-100 dark:bg-gray-950 dark:text-white flex justify-center items-center duration-200">
      <div className="h-175 w-175 bg-orange-200 dark:bg-orange-400/20 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>

      <div className="container pb-8 sm:pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-10">
          <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
              Upto 50% off on all Men's Wear
            </h1>
            <p className="text-sm text-gray-500">
              Discover the latest trends in fashion and accessories. Enjoy incredible discounts on premium quality products.
            </p>
            <div>
              <button className="bg-linear-to-r from-orange-400 to-amber-500 hover:scale-105 duration-200 text-white py-2 px-4 rounded-full">
                Order Now
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 sm:order-2 relative z-10">
            <img
              src="./assets/hero/women.png"
              alt="Model holding shopping bags"
              className="w-75 h-75 sm:w-112.5 sm:h-112.5 sm:scale-105 lg:scale-120 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
