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
  };
  return (
    <div className="w-full bg-white py-6 px-4 sm:py-10 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-1 h-6 sm:h-8 bg-[#db4444] rounded"></div>
          <h2 className="font-medium text-red-500 text-sm sm:text-base">Categories</h2>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Browse By Category</h1>
        
        {/* Mobile: Grid layout, Desktop: Horizontal scroll */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.label)}
                className={`flex flex-col items-center justify-center h-24 border-2 rounded-md cursor-pointer transition-all touch-manipulation
                  ${
                    activeCategory === category.label
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-300 hover:border-red-500 active:border-red-500 active:bg-red-500 active:text-white"
                  }`}
              >
                <div className="scale-75">{category.icon}</div>
                <span className="mt-1 text-xs font-medium text-center">
                  {category.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4 w-full overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.label)}
                  className={`flex flex-col items-center justify-center min-w-[140px] h-32 border-2 rounded-md cursor-pointer transition-all
                    ${
                      activeCategory === category.label
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                >
                  {category.icon}
                  <span className="mt-2 text-sm font-medium">
                    {category.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;