"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  Headphones,
  Laptop,
  Phone,
  Watch,
  Gamepad2,
} from "lucide-react";

const categories = [
  { icon: <Phone size={32} />, label: "Phones" },
  { icon: <Laptop size={32} />, label: "Computers" },
  { icon: <Watch size={32} />, label: "SmartWatch" },
  { icon: <Camera size={32} />, label: "Camera" },
  { icon: <Headphones size={32} />, label: "HeadPhones" },
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
    <div className="w-100% bg-white py-10">
      <div className="max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-[#db4444] rounded"></div>
          <h2 className="font-medium text-red-500">Categories</h2>
        </div>
        <h1 className="text-3xl font-bold mb-8">Browse By Category</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 w-[96%] overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.label)}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-md cursor-pointer transition
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
  );
};

export default CategorySection;
