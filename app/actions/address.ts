"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Country } from "@/lib/generated/prisma";

type AddressInput = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: Country;
};

export async function getUserAddresses() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { defaultAddressId: true },
  });

  const addresses = await prisma.address.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
  });

  // Put default address first
  return addresses
    .map((a) => ({
      ...a,
      isDefault: a.id === user?.defaultAddressId,
    }))
    .sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0));
}

export async function createAddress(data: AddressInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  data.street = capitalizeFirst(data.street);
  data.city = capitalizeFirst(data.city);
  data.state = capitalizeFirst(data.state);

  const [address, user] = await Promise.all([
    prisma.address.create({
      data: { ...data, user_id: userId },
    }),

    // If user has no default address, auto-set this one
    prisma.user.findUnique({
      where: { id: userId },
      select: { defaultAddressId: true },
    }),
  ]);
  if (!user?.defaultAddressId) {
    await prisma.user.update({
      where: { id: userId },
      data: { defaultAddressId: address.id },
    });
  }

  return { success: true, address };
}

export async function updateAddress(id: string, data: AddressInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  data.street = capitalizeFirst(data.street);
  data.city = capitalizeFirst(data.city);
  data.state = capitalizeFirst(data.state);

  // Verify ownership
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.user_id !== userId) {
    return { error: "Address not found." };
  }

  await prisma.address.update({
    where: { id },
    data,
  });

  return { success: true };
}

export async function deleteAddress(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.user_id !== userId) {
    return { error: "Address not found." };
  }

  // If deleting the default, clear it
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { defaultAddressId: true },
  });

  await prisma.$transaction(async (tx) => {
    if (user?.defaultAddressId === id) {
      await tx.user.update({
        where: { id: userId },
        data: { defaultAddressId: null },
      });
    }

    await tx.address.delete({ where: { id } });
  });

  return { success: true };
}

export async function setDefaultAddress(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.user_id !== userId) {
    return { error: "Address not found." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { defaultAddressId: id },
  });

  return { success: true };
}

function capitalizeFirst(str: string) {
  if (!str.trim()) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
