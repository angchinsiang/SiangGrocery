import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ItemManager from "./ItemManager";

export default async function CheckoutPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: `/store/checkout` });
  }

  let groceryItems = [];
  const singleProduct: { SKU: string; quantity: number }[] | undefined = (
    await cookies()
  ).get("single_product")?.value
    ? JSON.parse((await cookies()).get("single_product")?.value || "")
    : undefined;

  console.log(
    `\n\n${JSON.stringify(
      singleProduct?.map((item) => item.SKU) || "empty",
      null,
      2,
    )}\n\n`,
  );
  const cartProduct: { SKU: string; quantity: number }[] = (
    await cookies()
  ).get("cart_products")?.value
    ? JSON.parse((await cookies()).get("cart_products")?.value || "[]")
    : [];

  const idArray =
    singleProduct && singleProduct?.length > 0
      ? singleProduct.map((item) => item.SKU)
      : cartProduct.map((item) => item.SKU);

  console.log(`\n\nidArray: ${JSON.stringify(idArray, null, 2)}\n\n`);
  // 1. Fetch the user's active cart
  groceryItems = await prisma.grocery.findMany({
    where: { id: { in: idArray } },
    include: {
      listedProducts: {
        where: { isDisplay: true },
      },
    },
  });

  console.log(`\n\ngrocery: ${JSON.stringify(groceryItems, null, 2)}\n\n`);
  if (!groceryItems || groceryItems.length === 0) {
    redirect("/store");
  }

  // 2. Fetch Coupons (Shipping & Discount)
  // For simplicity, fetching all active coupons and applying the first applicable
  const activeCoupons = await prisma.user_Coupon.findMany({
    where: {
      user_id: userId,
      status: "UNREDEEMED",
      coupon: { status: "ACTIVE" },
    },
    include: {
      coupon: true,
    },
  });

  const shippingCoupon = activeCoupons
    .filter((c) => c.coupon.type === "SHIPPING")
    .map((c) => c.coupon);
  const discountCoupon = activeCoupons
    .filter((c) => c.coupon.type === "DISCOUNT")
    .map((c) => c.coupon);

  // 3. Prepare items with calculated prices
  const orderItems = groceryItems.map((groceryItem) => {
    const listedProduct = groceryItem.listedProducts[0]; // Assuming at least one displayed product

    // Price logic: prioritize discount_price if available, otherwise original_price
    const unitPrice =
      listedProduct?.discount_price > 0
        ? listedProduct.discount_price
        : listedProduct?.original_price || 0;

    const quantity =
      singleProduct?.find((item) => item.SKU === groceryItem.id)?.quantity ||
      cartProduct?.find((item) => item.SKU === groceryItem.id)?.quantity ||
      1;

    return {
      SKU: groceryItem.id,
      name: groceryItem.name,
      image: groceryItem.image,
      country: groceryItem.country,
      quantity: quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  return (
    // <BodyTemplate>
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Check Out</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart Items */}
        <ItemManager
          initialItems={orderItems}
          isCart={singleProduct && singleProduct.length > 0 ? false : true}
          shippingCoupon={shippingCoupon}
          discountCoupon={discountCoupon}
        />
      </div>
    </main>
    // </BodyTemplate>
  );
}
