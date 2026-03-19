import React from "react";

const RecepientDetailStripe = ({
  receipient,
  address,
  phone,
}: {
  receipient: string;
  address: string;
  phone: string;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gray-100 px-4 py-2">
      <div>
        <p className="font-bold text-md">Recipient </p>
        <p className="text-sm">{receipient}</p>
      </div>
      <div>
        <p className="font-bold text-md">Address</p>
        <p className="text-sm">{address}</p>
      </div>
    </div>
  );
};

export default RecepientDetailStripe;
