"use client";
import { deleteSingleProduct } from "@/actions/cookies-bundle/cookieActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";

const CheckOutButton = () => {
  const router = useRouter();
  const [isClikced, setIsClikced] = useState(false);
  const { checkedCount } = useCart();
  return (
    <Button
      disabled={isClikced || checkedCount === 0}
      onClick={async () => {
        setIsClikced(true);
        await deleteSingleProduct();
        router.push("/store/checkout");
        setTimeout(() => setIsClikced(false), 2000);
      }}
      className="h-full rounded-none text-lg font-bold text-black bg-[#FFC188] hover:bg-orange-400"
    >
      Check Out
    </Button>
  );
};

export default CheckOutButton;
