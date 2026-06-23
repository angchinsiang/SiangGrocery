"use client";

import { createAddress, updateAddress } from "@/app/actions/address";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country } from "@/lib/generated/prisma";
import { AddressFormData, addressSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

// ponytail: short list per user request, expand if needed
const COUNTRIES: Country[] = [...(Object.values(Country) as Country[])];

type ExistingAddress = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: Country;
} | null;

export default function AddressForm({
  existingAddress,
  onClose,
}: {
  existingAddress: ExistingAddress;
  onClose: () => void;
}) {
  const isEdit = !!existingAddress;
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [street, setStreet] = useState(existingAddress?.street || "");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Malaysia",
    },
  });

  const handleFormSubmit = handleSubmit(async (data: AddressFormData) => {
    startTransition(async () => {
      setError(null);

      const res = isEdit
        ? await updateAddress(existingAddress!.id, data)
        : await createAddress(data);

      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onClose();
    });
  });

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm bg-background focus:ring-2 focus:ring-[#f8b878] focus:border-[#f8b878] outline-none";

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">
        {isEdit ? "Edit Address" : "Add New Address"}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Street</label>
        <input
          {...register("street")}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="123 Main Street"
          className={inputClass}
        />
        {errors.street?.message && (
          <p className="text-red-600 text-sm pt-1">* {errors.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            {...register("city")}
            value={isEdit ? existingAddress.city : undefined}
            placeholder="Kuala Lumpur"
            className={inputClass}
          />
          {errors.city?.message && (
            <p className="text-red-600 text-sm pt-1">* {errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            {...register("state")}
            value={isEdit ? existingAddress.state : undefined}
            placeholder="Selangor"
            className={inputClass}
          />
          {errors.state?.message && (
            <p className="text-red-600 text-sm pt-1">
              * {errors.state.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            {...register("postalCode")}
            value={isEdit ? existingAddress.postalCode : undefined}
            placeholder="50000"
            className={inputClass}
            maxLength={5}
          />
          {errors.postalCode?.message && (
            <p className="text-red-600 text-sm pt-1">
              * {errors.postalCode.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select
                onValueChange={(e) => field.onChange(e as Country)}
                value={isEdit ? existingAddress.country : undefined}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Choose your country..." />
                </SelectTrigger>
                <SelectContent className="h-[20rem] overflow-y-scroll">
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {COUNTRIES.map((c) => (
                      <SelectItem
                        className="cursor-pointer h-10"
                        key={c}
                        value={c}
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country?.message && (
            <p className="text-red-600 text-sm pt-1">
              * {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-[#f8b878] hover:bg-[#f0a860] text-gray-900 font-semibold py-5 rounded-xl"
        >
          {isPending ? "Saving..." : isEdit ? "Update Address" : "Add Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="flex-1 py-5 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
