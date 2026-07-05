import React from "react";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0 dark:bg-gray-900 dark:text-white duration-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* image section */}
          <div>
            <img
              src="./assets/women/women2.jpg"
              alt="Banner"
              className="max-w-[400px] h-[350px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] object-cover rounded-xl"
            />
          </div>
          {/* text details section */}
          <div className="flex flex-col justify-center gap-6 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Winter Sale upto 50% Off
            </h1>
            <p className="text-sm text-gray-500 tracking-wide leading-5">
              Upgrade your wardrobe with our exclusive winter collection. Designed to keep you warm without compromising on style.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-lock text-2xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-violet-500 dark:text-violet-900 flex justify-center items-center"></i>
                <p>Quality Products</p>
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-truck-fast text-2xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400 text-orange-500 dark:text-orange-900 flex justify-center items-center"></i>
                <p>Fast Delivery</p>
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-wallet text-2xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400 text-green-500 dark:text-green-900 flex justify-center items-center"></i>
                <p>Easy Payment method</p>
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-tags text-2xl h-12 w-12 shadow-sm p-4 rounded-full bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-900 flex justify-center items-center"></i>
                <p>Get Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
