import React from "react";
import { Badge } from "@/components/ui/badge";

const ColorBadge = ({ color }: { color: string }) => {
  const colors = `bg-${color}-50 text-${color}-700 dark:bg-${color}-950 dark:text-${color}-300`;

  return (
    <div>
      <Badge className={colors}>{color}</Badge>
    </div>
  );
};
export default ColorBadge;
