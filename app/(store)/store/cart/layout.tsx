import React from "react";

const CheckoutLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative">
      <div className="pb-20">{children}</div>
    </div>
  );
};

export default CheckoutLayout;
