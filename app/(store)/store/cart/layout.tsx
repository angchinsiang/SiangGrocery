import React from "react";
import CheckOutStripe from "./CheckOutStripe";

const CheckoutLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative">
      <div className="pb-20">{children}</div>
      <CheckOutStripe totalPrice={100.99} />
    </div>
  );
};

export default CheckoutLayout;
