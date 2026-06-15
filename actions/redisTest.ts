"use server";

import { redis } from "@/lib/redis";

export async function testRedis(id: string) {
  console.log(id);
  await redis.set(
    `checkout:${id}`,
    JSON.stringify({
      skus: [
        {
          SKU: id,
          quantity: 1,
        },
      ],
      isCart: "false",
      shippingCouponId: "",
      discountCouponId: "",
    }),
  );
}
export async function delRedis(id: string) {
  const del = await redis.del(`checkout:${id}`);
  console.log("Deleted:", del);
}
