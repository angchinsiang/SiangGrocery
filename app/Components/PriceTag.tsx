import React from "react";

const PriceTag = ({
  oriPrice,
  price,
  unit,
}: {
  oriPrice: number;
  price: number;
  unit: string;
}) => {
  return (
    <div>
      <p className="line-through text-xs text-gray-400 font-medium mr-2">
        ${oriPrice}
      </p>
      <p className="text-red-600 font-bold text-2xl">
        ${price}{" "}
        <span className="text-sm font-normal text-gray-600">/ {unit}</span>
      </p>
    </div>
  );
};

export default PriceTag;
