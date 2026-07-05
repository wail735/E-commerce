import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
      <h1 className="text-9xl font-bold text-orange-400">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors duration-200 inline-block"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
