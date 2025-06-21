"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  Headphones,
  Laptop,
  Watch,
  Gamepad2,
} from "lucide-react";
import { MdPhoneAndroid } from 'react-icons/md';

const categories = [
  { icon: <MdPhoneAndroid size={32} />, label: "Phone" },
  { icon: <Laptop size={32} />, label: "Computer" },
  { icon: <Watch size={32} />, label: "Watch" },
  { icon: <Camera size={32} />, label: "Camera" },
  { icon: <Headphones size={32} />, label: "Audio" },
  { icon: <Gamepad2 size={32} />, label: "Gaming" },
];

const CategorySection: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleCategoryClick = (categoryLabel: string) => {
    if (activeCategory === categoryLabel) {
      router.push("/product"); // Reset ke semua produk
    } else {
      router.push(`/product?category=${categoryLabel}`);
    }
  };  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-8 bg-red-500 rounded"></div>
        <span className="text-red-500 font-medium">Categories</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Browse By Category</h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.label)}
            className={`group cursor-pointer transition-all duration-300 ${
              activeCategory === category.label
                ? "transform scale-105"
                : "hover:transform hover:scale-105"
            }`}
          >
            {/* Category Card */}
            <div
              className={`flex flex-col items-center justify-center h-32 border-2 rounded-lg transition-all duration-300 ${
                activeCategory === category.label
                  ? "border-red-500 bg-red-500 text-white shadow-lg"
                  : "border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md"
              }`}
            >
              <div className="mb-2">
                {category.icon}
              </div>
              <span className="text-sm font-medium text-center">
                {category.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;