"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Description = ({ description }: { description: string }) => {
  const [hasClicked, setHasClicked] = useState(false);

  return (
    <div className="flex flex-col gap-5 ">
      <div
        className={`relative text-muted-foreground text-sm ${
          hasClicked ? "line-clamp-none" : "line-clamp-5"
        }`}
      >
        {description}
        <div
          className={`${hasClicked ? "opacity-0" : "opacity-100"} absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent pointer-events-none`}
        ></div>
      </div>
      <div className="flex justify-center">
        <Button variant="link" onClick={() => setHasClicked((prev) => !prev)}>
          {hasClicked ? "Read Less" : "Read More"}
        </Button>
      </div>
    </div>
  );
};

export default Description;
