"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Description = ({ description }: { description: string }) => {
  const [hasClicked, setHasClicked] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-muted-foreground text-sm">{description}</div>
      <div className="flex justify-center">
        {!hasClicked && (
          <Button variant="link" onClick={() => setHasClicked((prev) => !prev)}>
            Read More
          </Button>
        )}
      </div>
    </div>
  );
};

export default Description;
