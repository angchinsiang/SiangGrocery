"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaCheck, FaRegShareFromSquare } from "react-icons/fa6";

const ShareButton = ({ name }: { name: string }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const handleCopy = async () => {
    const shareURL = window.location.href;
    const shareData = {
      title: `SiangGrocery - ${name}`,
      text: `Check out this *${name}* on SiangGrocery!`,
      url: shareURL,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error(`Error sharing: ${error}`);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareURL);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      } catch (error) {
        console.error(`Error copying to clipboard: ${error}`);
      }
    }
  };
  return (
    <Button
      variant="ghost"
      className={`hover:bg-gray-100 cursor-pointer ${hasCopied ? "pointer-events-none" : ""}`}
      onClick={handleCopy}
    >
      {hasCopied ? (
        <FaCheck className="size-5 text-green-600" />
      ) : (
        <FaRegShareFromSquare className="size-4" />
      )}
    </Button>
  );
};

export default ShareButton;
