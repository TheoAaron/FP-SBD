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
    <div className="w-full bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-8 bg-[#db4444] rounded"></div>
          <h2 className="text-sm font-semibold" style={{ color: "#db4444" }}>
            Categories
          </h2>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Browse By Category</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 w-full overflow-x-auto scrollbar-hide">
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
