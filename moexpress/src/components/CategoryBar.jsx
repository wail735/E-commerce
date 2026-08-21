import React from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop, ShirtIcon, Home, Dumbbell, Sparkles, Car,
  Gamepad2, Baby, Watch, Smartphone, Monitor, ShoppingBag, MoreHorizontal
} from 'lucide-react';

const categories = [
  { id: 1,  name: "Electronics",   slug: "electronics",   icon: Laptop,       color: "#2563EB", bg: "#DBEAFE" },
  { id: 2,  name: "Fashion",       slug: "fashion",       icon: ShirtIcon,    color: "#DB2777", bg: "#FCE7F3" },
  { id: 3,  name: "Home & Garden", slug: "home",          icon: Home,         color: "#D97706", bg: "#FEF3C7" },
  { id: 4,  name: "Beauty",        slug: "beauty",        icon: Sparkles,     color: "#9333EA", bg: "#F3E8FF" },
  { id: 5,  name: "Sports",        slug: "sports",        icon: Dumbbell,     color: "#16A34A", bg: "#DCFCE7" },
  { id: 6,  name: "Toys & Kids",   slug: "toys",          icon: Baby,         color: "#EA580C", bg: "#FFEDD5" },
  { id: 7,  name: "Automotive",    slug: "automotive",    icon: Car,          color: "#DC2626", bg: "#FEE2E2" },
  { id: 8,  name: "Phones",        slug: "phones",        icon: Smartphone,   color: "#0891B2", bg: "#CFFAFE" },
  { id: 9,  name: "Gaming",        slug: "gaming",        icon: Gamepad2,     color: "#7C3AED", bg: "#EDE9FE" },
  { id: 10, name: "Watches",       slug: "watches",       icon: Watch,        color: "#059669", bg: "#D1FAE5" },
  { id: 11, name: "Bags",          slug: "bags",          icon: ShoppingBag,  color: "#B45309", bg: "#FEF9C3" },
  { id: 12, name: "Computers",     slug: "computers",     icon: Monitor,      color: "#1D4ED8", bg: "#EFF6FF" },
  { id: 13, name: "More",          slug: "categories",    icon: MoreHorizontal, color: "#6B7280", bg: "#F3F4F6" },
];

const CategoryBar = () => {
  return (
    <section className="w-full mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] sm:text-base font-bold text-gray-800 font-display tracking-tight">
          Browse Categories
        </h2>
        <Link
          to="/categories"
          className="text-xs sm:text-sm text-[#FF4D20] font-medium hover:underline transition-colors"
        >
          All Categories →
        </Link>
      </div>

      <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 min-w-[64px] sm:min-w-[76px] flex-shrink-0 group"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                style={{ backgroundColor: cat.bg }}
              >
                <Icon size={22} color={cat.color} strokeWidth={1.8} />
              </div>

              <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 group-hover:text-[#FF4D20] transition-colors text-center leading-tight whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 border-b border-gray-100" />
    </section>
  );
};

export default CategoryBar;
