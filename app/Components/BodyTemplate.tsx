import { Button } from "@/components/ui/button";
import React from "react";
import { IoFilterSharp } from "react-icons/io5";

const BodyTemplate = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header: string;
}) => {
  return (
    <div className="flex flex-col gap-10 px-10 py-6">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">{header}</p>
        <Button variant="ghost">
          <IoFilterSharp className="size-5" />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default BodyTemplate;
