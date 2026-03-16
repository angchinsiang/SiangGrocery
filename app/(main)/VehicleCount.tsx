import React, { ReactNode } from "react";

const VehicleInfo = ({
  icon,
  count,
}: {
  icon: React.ReactNode;
  count: number;
}) => {
  return (
    <div className="flex flex-col gap-3  justify-center items-center">
      <div className="flex justify-center items-center bg-[#7BC697] w-[3rem] aspect-square p-1 rounded-full">
        {icon}
      </div>
      <p className="font-bold text-xl">{count}+</p>
    </div>
  );
};

export default VehicleInfo;
