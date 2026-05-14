import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { IconType } from "react-icons";

const BodyTemplate = ({
  children,
  header,
  ButtonIcon,
  className,
}: {
  children: React.ReactNode;
  header?: string;
  ButtonIcon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-5 px-15 pt-5 pb-10", className)}>
      <div className="flex justify-between">
        {header && <p className="text-3xl font-bold">{header}</p>}
        {ButtonIcon && ButtonIcon}
      </div>
      {children}
    </div>
  );
};

export default BodyTemplate;
