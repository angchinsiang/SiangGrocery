import BodySection from "@/components/server/BodyTemplate";
import { IoFilterSharp } from "react-icons/io5";
import CartItem from "./CartItem";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CartProvider } from "./CartContext";
import CheckOutStripe from "./CheckOutStripe";

export default async function CartPage() {
  const { userId } = await auth();
  if (!userId) redirect("/store");

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: {
      cartItems: {
        include: {
          grocery: {
            include: { listedProducts: true },
          },
        },
      },
    },
  });

  const cartItems =
    cart?.cartItems.map((item) => {
      const listedProduct = item.grocery.listedProducts[0];
      const unitPrice =
        listedProduct.discount_price > 0
          ? listedProduct.discount_price
          : listedProduct.original_price;
      return {
        SKU: item.grocery.id,
        productName: item.grocery.name,
        image: item.grocery.image,
        alt: item.grocery.name,
        oriPrice: listedProduct.original_price,
        discountPrice: unitPrice,
        unit: item.grocery.MoU,
        country: item.grocery.country,
        quantity: item.quantity,
      };
    }) || [];

  // Read checked SKUs from the cart_products cookie
  const cartProductsCookie = (await cookies()).get("cart_products")?.value;
  const checkedFromCookie: { SKU: string; quantity: number }[] =
    cartProductsCookie ? JSON.parse(cartProductsCookie) : [];
  const initialCheckedSKUs = checkedFromCookie.map((c) => c.SKU);

  return (
    <CartProvider
      initialItems={cartItems}
      initialCheckedSKUs={initialCheckedSKUs}
    >
      <BodySection
        header="Shopping Cart"
        ButtonIcon={<IoFilterSharp className="size-5" />}
      >
        <div className="flex flex-col gap-10">
          <CartItem />
        </div>
      </BodySection>
      <CheckOutStripe />
    </CartProvider>
  );
}
