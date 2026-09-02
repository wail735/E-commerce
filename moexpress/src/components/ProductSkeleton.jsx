import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700/50"></div>

            <div className="p-4 flex flex-col flex-1">
                {/* Title Placeholder */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded-md w-3/4 mb-2 mt-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded-md w-1/2 mb-4"></div>

                {/* Store name Placeholder */}
                <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded-md w-1/3 mb-3"></div>

                {/* Rating Placeholder */}
                <div className="flex gap-1 mb-4 mt-auto">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-gray-200 dark:bg-gray-700/50 rounded-full"></div>
                    ))}
                    <div className="w-6 h-3 bg-gray-200 dark:bg-gray-700/50 rounded-md ml-1"></div>
                </div>

                {/* Price Placeholder */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700/50 rounded-md w-1/3 mb-4"></div>

                {/* Button Placeholder */}
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700/50 rounded-xl mt-auto"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
