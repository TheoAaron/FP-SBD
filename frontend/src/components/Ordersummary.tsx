
import Image from "next/image";

interface OrderSummaryProps {
  mainItem: {
    name: string;
    image: string;
  };
  otherItemsCount: number;
}

export default function OrderSummary({ mainItem, otherItemsCount }: OrderSummaryProps) {
  return (
    <div className="flex flex-col items-center py-8">
      <Image
        src={mainItem.image}
        alt={mainItem.name}
        width={80}
        height={80}
        className="object-contain mb-4"
        priority
      />
      <div className="text-xl font-medium text-center">
        {mainItem.name}
        {otherItemsCount > 0 && (
          <> +{otherItemsCount}</>
        )}
      </div>
    </div>
  );
}