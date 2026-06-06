"use client";
import { setSingleProduct } from "@/actions/cookies-bundle/cookieActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CheckOutBtn = ({ SKU }: { SKU: string }) => {
  const [isClick, setIsClick] = useState(false);
  const router = useRouter();
  return (
    <>
      <Button
        variant="destructive"
        disabled={isClick}
        onClick={async () => {
          setIsClick(true);
          await setSingleProduct(SKU);
          router.push("/store/checkout");
          setTimeout(() => setIsClick(false), 2000);
        }}
        className="py-4.5 font-semibold text-base shadow-lg/5 border-red-200 "
      >
        Check Out
      </Button>
    </>
  );
};

export default CheckOutBtn;
