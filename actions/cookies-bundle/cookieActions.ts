"use server";
import { cookies } from "next/headers";

export async function setSingleProduct(SKU: string) {
  const productList: { SKU: string; quantity: number }[] = [
    { SKU: SKU, quantity: 1 },
  ];
  (await cookies()).set("single_product", JSON.stringify(productList), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
  });
}

export async function removeCartCookie(SKU: string) {
  const cartProducts = (await cookies()).get("cart_products")?.value;
  const cartProductsArray: { SKU: string; quantity: number }[] = cartProducts
    ? JSON.parse(cartProducts)
    : [];
  const existingProductIndex = cartProductsArray.findIndex(
    (item) => item.SKU === SKU,
  );

  if (existingProductIndex !== -1) {
    cartProductsArray.splice(existingProductIndex, 1);
  }

  (await cookies()).set("cart_products", JSON.stringify(cartProductsArray), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function setCartCookie(SKU: string, quantity: number) {
  // if (quantity <= 0) return;

  const cartProducts = (await cookies()).get("cart_products")?.value;
  const cartProductsArray: { SKU: string; quantity: number }[] = cartProducts
    ? JSON.parse(cartProducts)
    : [];
  const existingProductIndex = cartProductsArray.findIndex(
    (item) => item.SKU === SKU,
  );

  if (existingProductIndex !== -1) {
    cartProductsArray[existingProductIndex].quantity = quantity;
  } else {
    cartProductsArray.push({ SKU: SKU, quantity: quantity });
  }

  (await cookies()).set("cart_products", JSON.stringify(cartProductsArray), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function deleteSingleProduct() {
  (await cookies()).delete("single_product");
}

export async function deleteCartProduct() {
  (await cookies()).delete("cart_products");
}

export async function getCartProduct() {
  return (await cookies()).get("cart_products")?.value;
}

export async function getSingleProduct() {
  return (await cookies()).get("single_product")?.value;
}
