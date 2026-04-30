"use client";

import { fetchMediaAssets } from "@/app/actions/fetchMedia";
import { uploadGrocery } from "@/app/actions/uploadGrocery";
import useDebounce from "@/app/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Category,
  Form,
  MediaAsset,
  Media_Category,
  Media_Type,
  MoU,
} from "@/lib/generated/prisma";
import { GroceryFormData, grocerySchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCalendarXmark } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

const AddGroceryPage = () => {
  // const [date, setDate] = useState<Date | undefined>(new Date());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Media_Category[]>([]);
  const [type, setType] = useState<Media_Type[]>([]);
  const debouncedSearch = useDebounce(search, 500);
  const [mediaAssets, setMediaAssets] = useState<
    Omit<MediaAsset, "createdAt" | "updatedAt" | "status">[]
  >([]);
  const [previewMedias, setPreviewMedias] = useState<
    Omit<MediaAsset, "createdAt" | "updatedAt" | "status">[]
  >([]);
  const [open, setOpen] = useState(false);
  const [isCalender, setIsCalender] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroceryFormData>({
    resolver: zodResolver(grocerySchema),
    defaultValues: { isPromotion: false, status: true },
  });

  const categories = Object.values(Media_Category).map((cat) => ({
    value: cat,
    label: cat
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
  const mediaTypes = Object.values(Media_Type).map((cat) => ({
    value: cat,
    label: cat
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const handleCategory = (value: Media_Category) => {
    setCategory((prev) => {
      if (prev.includes(value)) return prev.filter((p) => p !== value);
      return [...prev, value];
    });
  };
  const handleType = (value: Media_Type) => {
    setType((prev) => {
      if (prev.includes(value)) return prev.filter((p) => p !== value);
      return [...prev, value];
    });
  };
  const removeFilter = (e: React.MouseEvent, value: Media_Category) => {
    e.stopPropagation();
    setCategory((prev) => prev.filter((p) => p !== value));
  };
  const removeType = (e: React.MouseEvent, value: Media_Type) => {
    e.stopPropagation();
    setType((prev) => prev.filter((p) => p !== value));
  };

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [debouncedSearch, category, type],
    queryFn: ({ pageParam }) =>
      fetchMediaAssets({
        cursor: pageParam ?? "",
        category: category,
        name: debouncedSearch,
        type,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: {
      data: MediaAsset[];
      nextCursor: string | undefined;
    }) => {
      return lastPage.nextCursor;
    },
  });

  const flatData = data?.pages.flatMap((page) => page.data) || [];

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleUpload = async (data: GroceryFormData) => {
    try {
      await uploadGrocery(data);
      window.location.reload();
      alert("Grocery added successfully");

      // reset({
      //   name: "",
      //   description: "",
      //   category: undefined,
      //   form: undefined,
      //   mou: undefined,
      //   expiryDate: new Date(),
      //   isPromotion: false,
      //   status: true,
      // });
      // setPreviewMedias([]);
      // setMediaAssets([]);
    } catch (error) {
      alert(`Failed to add grocery: ${error}`);
    }
  };
  return (
    <div className="w-full flex justify-center py-5">
      <form
        className="w-3/7 ring-1 ring-gray-300 rounded-lg p-6"
        onSubmit={handleSubmit(handleUpload)}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Grocery Details</FieldLegend>
            <FieldDescription>
              Enter the details of the grocery you want to add.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Name
                </FieldLabel>
                <Input
                  {...register("name")}
                  id="checkout-7j9-card-name-43j"
                  placeholder="e.g. Brocolli..."
                  required
                />
                {errors.name?.message && (
                  <FieldDescription className="text-red-500">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Description
                  {errors.description?.message && (
                    <span className="text-red-500 -ml-1">*</span>
                  )}
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  id="checkout-7j9-optional-comments"
                  placeholder="e.g. Fresh brocolli..."
                  className="resize-none"
                />
                {/* {errors.description?.message && (
                  <FieldDescription className="text-red-500">
                    {errors.description.message}
                  </FieldDescription>
                )} */}
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Image/Video
                  {errors.mediaURL?.message && (
                    <span className="text-red-500 -ml-1">*</span>
                  )}
                </FieldLabel>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={`border border-gray-300 hover:bg-white rounded-md p-1 ${
                        mediaAssets.length > 0
                          ? "h-auto flex flex-wrap justify-start gap-2"
                          : "h-8"
                      }`}
                      onClick={() => {
                        setPreviewMedias(mediaAssets);
                      }}
                    >
                      {mediaAssets.length > 0
                        ? mediaAssets.map((media) => (
                            <div
                              key={media.id}
                              className="w-fit p-0.5 flex justify-center items-center gap-2 ring-2 ring-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
                            >
                              <Image
                                src={media.url}
                                alt={media.altText ?? media.name}
                                width={120}
                                height={120}
                                className="rounded-md"
                              />
                            </div>
                          ))
                        : "Select Image/Video"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>
                        Select Product Image (Maximum 5)
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Search images (e.g., Apple)..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        {/* You can add a standard <select> here to change the `category` state */}
                      </div>
                      <div>
                        <Popover modal={true}>
                          <PopoverTrigger asChild className="h-auto py-2">
                            <Button variant="outline" className="w-full">
                              {category.length > 0 || type.length > 0 ? (
                                <div className="flex flex-wrap">
                                  {category.map((f) => {
                                    const label = categories.find(
                                      (c) => c.value === f,
                                    )?.label;
                                    return (
                                      <Badge
                                        key={f}
                                        variant="secondary"
                                        className="mr-1 mx-1 text-green-600 bg-green-50"
                                      >
                                        {label}
                                        <div
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => removeFilter(e, f)}
                                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                          <X className="h-3 w-3 text-gray-500 hover:text-gray-900 cursor-pointer" />
                                        </div>
                                      </Badge>
                                    );
                                  })}
                                  {type.map((f) => {
                                    const label = mediaTypes.find(
                                      (c) => c.value === f,
                                    )?.label;
                                    return (
                                      <Badge
                                        key={f}
                                        variant="secondary"
                                        className="mr-1 mx-1 text-violet-600 bg-violet-50"
                                      >
                                        {label}
                                        <div
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => removeType(e, f)}
                                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                          <X className="h-3 w-3 text-gray-500 hover:text-gray-900 cursor-pointer" />
                                        </div>
                                      </Badge>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 h-3">
                                  <LuSettings2 className="size-4" />
                                  Filter
                                </div>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>

                                <CommandGroup heading="Categories">
                                  {categories.map(({ value, label }) => {
                                    const isSelected = category.includes(value);
                                    return (
                                      <CommandItem
                                        key={value}
                                        value={value}
                                        onSelect={(e) => handleCategory(value)}
                                        className="cursor-pointer text-emerald-600"
                                      >
                                        <Checkbox
                                          id={value}
                                          name={value}
                                          checked={isSelected}
                                        />
                                        {label}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Media Type">
                                  {mediaTypes.map(({ value, label }) => {
                                    const isSelected = type.includes(value);
                                    return (
                                      <CommandItem
                                        key={value}
                                        value={value}
                                        onSelect={(e) => handleType(value)}
                                        className="cursor-pointer text-emerald-600"
                                      >
                                        <Checkbox
                                          id={value}
                                          name={value}
                                          checked={isSelected}
                                        />
                                        {label}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <Controller
                      control={control}
                      name="mediaURL"
                      render={({ field }) => (
                        <div className="overflow-y-auto flex flex-col gap-4 px-2 py-1">
                          {isError ? (
                            <p className="text-red-500">
                              Error fetching media assets
                            </p>
                          ) : isLoading ? (
                            <p className="text-gray-500">
                              Loading media assets...
                            </p>
                          ) : (
                            flatData.map(
                              ({ id, name, url, category, type, altText }) => (
                                <div
                                  key={id}
                                  className="flex gap-2 relative ring-2 ring-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    if (
                                      previewMedias.some((p) => p.url === url)
                                    ) {
                                      setPreviewMedias(
                                        previewMedias.filter(
                                          (p) => p.url !== url,
                                        ),
                                      );
                                    } else {
                                      if (previewMedias.length >= 5) {
                                        toast.error(
                                          "Maximum 5 media assets can be selected",
                                        );
                                        return;
                                      }
                                      setPreviewMedias([
                                        ...previewMedias,
                                        {
                                          id,
                                          name,
                                          url,
                                          category,
                                          type,
                                          altText,
                                        },
                                      ]);
                                    }
                                  }}
                                >
                                  <Image
                                    src={url}
                                    alt={altText ?? name}
                                    width={150}
                                    height={150}
                                  />
                                  {previewMedias.some((p) => p.url === url) && (
                                    <div className="absolute h-5 w-5 bg-emerald-600 text-white flex items-center justify-center rounded-full top-2 right-2">
                                      {previewMedias.findIndex(
                                        (p) => p.url === url,
                                      ) + 1}
                                    </div>
                                  )}
                                  <div className="py-2 flex flex-col gap-1">
                                    <p className="text-sm font-medium">
                                      {name}
                                    </p>
                                    <div className="flex gap-1">
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-50 text-green-600 text-xs"
                                      >
                                        {category}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-indigo-50 text-indigo-600 text-xs"
                                      >
                                        {type}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )
                          )}
                          {hasNextPage && (
                            <div ref={ref} className="flex justify-center py-8">
                              {isFetchingNextPage && (
                                <div className="text-gray-500 font-medium animate-pulse">
                                  Load More...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPreviewMedias([]);
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => {
                          const newMediaList = previewMedias.map((prev) => {
                            return {
                              id: prev.id,
                              url: prev.url,
                              type: prev.type,
                            };
                          });
                          setMediaAssets(previewMedias);
                          setPreviewMedias([]);
                          setValue("mediaURL", newMediaList, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                          setOpen(false);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* <FieldDescription className="text-red-500">
                  {errors.mediaURL?.message}
                </FieldDescription> */}
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="checkout-category-ts6">
                    Category
                    {errors.category?.message && (
                      <span className="text-red-500 -ml-1">*</span>
                    )}
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        defaultValue=""
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="checkout-category-ts6">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(Category).map((category) => {
                              const formattedName = category
                                .replace(/_/g, " ") // Replace underscores with spaces
                                .toLowerCase() // Make it all lowercase
                                .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
                              return (
                                <SelectItem key={category} value={category}>
                                  {formattedName}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {/* {errors.category?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.category.message}
                    </FieldDescription>
                  )} */}
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-form-f59">
                    Form
                    {errors.form?.message && (
                      <span className="text-red-500 -ml-1">*</span>
                    )}
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="form"
                    render={({ field }) => (
                      <Select
                        defaultValue=""
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="checkout-7j9-form-f59">
                          <SelectValue placeholder="Select Form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(Form).map((form) => (
                              <SelectItem key={form} value={form}>
                                {form}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {/* {errors.form?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.form.message}
                    </FieldDescription>
                  )} */}
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-mou-f59">
                    MoU
                    {errors.mou?.message && (
                      <span className="text-red-500 -ml-1">*</span>
                    )}
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="mou"
                    render={({ field }) => (
                      <Select
                        defaultValue=""
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="checkout-7j9-mou-f59">
                          <SelectValue placeholder="Select MoU" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(MoU).map((mou) => (
                              <SelectItem key={mou} value={mou}>
                                {mou}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {/* {errors.mou?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.mou.message}
                    </FieldDescription>
                  )} */}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <Field orientation="horizontal">
              <Field orientation="horizontal">
                <Checkbox
                  id="checkout-7j9-activate-wgm"
                  defaultChecked
                  {...register("status")}
                />
                <FieldLabel htmlFor="checkout-7j9-activate-wgm">
                  Activate
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="checkout-7j9-promotion-wgm"
                  {...register("isPromotion")}
                />
                <FieldLabel htmlFor="checkout-7j9-promotion-wgm">
                  Is Promotion
                </FieldLabel>
              </Field>
              <Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="checkout-7j9-expiration-date-f59">
                    Expiration Date
                    {errors.expiryDate?.message && (
                      <span className="text-red-500 -ml-2">*</span>
                    )}
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="expiryDate"
                    render={({ field }) => (
                      <Popover open={isCalender} onOpenChange={setIsCalender}>
                        <PopoverTrigger asChild>
                          <Button
                            className="aspect-square h-8 rounded-full"
                            variant="outline"
                          >
                            <FaCalendarXmark className="size-4 " />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsCalender(false);
                            }}
                            className="rounded-lg border"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </Field>
                {/* <FieldDescription className="text-red-500">
                  {errors.expiryDate?.message}
                </FieldDescription> */}
              </Field>
            </Field>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Adding...
                </span>
              ) : (
                "Add Grocery"
              )}
            </Button>
            <Button variant="outline" type="button" onClick={() => reset()}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};
export default AddGroceryPage;
