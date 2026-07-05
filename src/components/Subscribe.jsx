import React from "react";

const Subscribe = () => {
  return (
    <div
      className="mb-20 bg-gray-100 dark:bg-gray-800 text-white"
      style={{
        backgroundImage: "url('./assets/website/orange-pattern.jpg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container backdrop-blur-sm py-10 mx-auto px-4">
        <div className="space-y-6 max-w-xl mx-auto">
          <h1 className="text-2xl !text-center sm:text-left sm:text-4xl font-semibold">
            Get Notified About New Products
          </h1>
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full p-3 text-black rounded-lg outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
