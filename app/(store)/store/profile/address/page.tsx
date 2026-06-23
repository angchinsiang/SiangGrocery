"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/app/actions/address";
import BodyTemplate from "@/components/server/BodyTemplate";
import { Button } from "@/components/ui/button";
import { FaPlus, FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import AddressForm from "./AddressForm";
import type { Country } from "@/lib/generated/prisma";

type AddressWithDefault = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: Country;
  isDefault: boolean;
};

export default function AddressPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressWithDefault | null>(null);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => getUserAddresses(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const setDefaultMut = useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const openEdit = (addr: AddressWithDefault) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingAddress(null);
    setShowForm(false);
  };

  return (
    <BodyTemplate
      header="My Addresses"
      ButtonIcon={
        <Link href="/store/profile">
          <Button variant="ghost" size="icon">
            <IoArrowBack className="size-5" />
          </Button>
        </Link>
      }
    >
      {showForm ? (
        <AddressForm existingAddress={editingAddress} onClose={closeForm} />
      ) : (
        <div className="flex flex-col gap-4">
          <Button
            onClick={openCreate}
            className="w-full flex items-center gap-2 bg-[#f8b878] hover:bg-[#f0a860] text-gray-900 font-semibold py-6 rounded-xl"
          >
            <FaPlus className="size-4" />
            Add New Address
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f8b878]" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No addresses saved yet.
            </p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative rounded-xl border p-5 transition-colors ${
                  addr.isDefault
                    ? "border-[#f8b878] bg-[#f8b878]/5"
                    : "border-gray-200"
                }`}
              >
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-xs font-bold text-[#f8b878] bg-[#f8b878]/10 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <p className="font-semibold">{addr.street}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>

                <div className="flex gap-2 mt-3">
                  {!addr.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultMut.mutate(addr.id)}
                      disabled={setDefaultMut.isPending}
                      className="text-xs gap-1"
                    >
                      <FaRegStar className="size-3" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(addr)}
                    className="text-xs gap-1"
                  >
                    <FaRegEdit className="size-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMut.mutate(addr.id)}
                    disabled={deleteMut.isPending}
                    className="text-xs gap-1 text-red-500 hover:text-red-600 hover:border-red-300"
                  >
                    <FaTrash className="size-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </BodyTemplate>
  );
}
