import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

const getStarTypes = (rating: number): ("full" | "half" | "empty")[] => {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push("full");
    } else if (rating >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }
  return stars;
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = getStarTypes(rating);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((type, index) => (
        <div key={index} className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-300" />
          {type !== "empty" && (
            <div
              className={`absolute top-0 left-0 h-full overflow-hidden ${
                type === "half" ? "w-1/2" : "w-full"
              }`}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StarRating;