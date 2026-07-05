import React from "react";

const TestimonialData = [
  {
    id: 1,
    name: "Satya Nadella",
    text: "The quality of the clothes is fantastic, and the delivery was incredibly fast. I'll definitely be shopping here again!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Virat Kohli",
    text: "I found exactly what I was looking for. The customer service is top-notch, and the products exceed expectations.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Sachin Tendulkar",
    text: "Amazing selection and great prices. Shopsy has become my go-to store for all my fashion needs.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  return (
    <div className="py-10 mb-10 dark:bg-gray-900 dark:text-white duration-200">
      <div className="container mx-auto px-4">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-orange-400">What our customers are saying</p>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-xs text-gray-400">
            Don't just take our word for it. Here is what our satisfied customers have to say about their experience.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TestimonialData.map((data) => (
            <div
              key={data.id}
              className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-orange-100/50 relative overflow-hidden"
            >
              <div className="mb-4">
                <img
                  src={data.img}
                  alt={data.name}
                  className="rounded-full w-20 h-20"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="space-y-3 relative z-10">
                  <p className="text-xs text-gray-500">{data.text}</p>
                  <h1 className="text-xl font-bold text-black/80 dark:text-white">
                    {data.name}
                  </h1>
                </div>
              </div>
              <p className="text-black/10 dark:text-white/10 text-9xl font-serif absolute top-[-30px] right-2 z-0">
                ,,
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
