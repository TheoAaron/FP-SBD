"use client";
import { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-50% bg-white py-10 ml-13">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-[#db4444] rounded"></div>
          <h2 className="font-medium text-red-500">
            Categories
          </h2>
        </div>
        <h1 className="text-3xl font-bold mb-8">Browse By Category</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 w-[96%] overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex flex-col items-center justify-center w-full h-32 border rounded-md cursor-pointer transition
                  ${activeIndex === index
                    ? "bg-white-400 border-red-500"
                    : "bg-white border-gray-500 hover:bg-red-300"}`}
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
