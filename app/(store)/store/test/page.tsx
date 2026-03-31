"use client";

import { uploadMediaAsset } from "@/app/actions/media";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Media_Category, Media_Type } from "@/lib/generated/prisma";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import brocolli from "@/public/Fresh Milk.png";
import { MediaFormData, mediaSchema } from "@/lib/imgUploadSchema";
import { Button } from "@/components/ui/button";

const TestPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      url: "",
      name: "",
      category: undefined,
      type: undefined,
      altText: "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const formCallback = async (data: MediaFormData) => {
    try {
      await uploadMediaAsset(data);
      alert("Media asset uploaded successfully");
      reset();
      setPreviewImage(null);
    } catch (error) {
      console.log(`Error uploading media asset: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-5">
      {/* <Alert className="max-w-lg">
        <CheckCircle2Icon />
        <AlertTitle>Media asset(s) uploaded successfully</AlertTitle>
        <AlertDescription>
          Your media asset(s) has been uploaded successfully. Changes will be
          reflected immediately.
        </AlertDescription>
      </Alert> */}
      <div className="w-3/7 flex justify-center ">
        {previewImage ? (
          <div className="flex flex-col gap-10 w-full items-center justify-center">
            <Image
              src={previewImage}
              alt="an image"
              width={450}
              height={450}
              className="rounded-lg"
            ></Image>
            <FieldGroup className="mt-2">
              <Field>
                <FieldDescription className="flex justify-center">
                  Preview Image
                </FieldDescription>
              </Field>
            </FieldGroup>
            <form
              className="flex flex-col gap-6 border w-full border-gray-300 rounded-lg p-6"
              onSubmit={handleSubmit(formCallback)}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <Input
                    id="url"
                    className="bg-gray-100 text-gray-500"
                    {...register("url")}
                    autoComplete="off"
                    placeholder="https://..."
                    readOnly
                  />
                  {errors.url?.message ? (
                    <FieldDescription className="text-red-500">
                      {errors.url.message}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      This Information is autofilled in.
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...register("name")}
                    id="name"
                    autoComplete="off"
                    placeholder="Name of grocery (e.g.Brocolli...)"
                  />
                  {errors.name?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.name.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Category</FieldLabel>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(Media_Category).map((category) => {
                              const formattedName = category
                                .replace(/_/g, " ") // Replace underscores with spaces
                                .toLowerCase() // Make it all lowercase
                                .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
                              return (
                                <SelectItem
                                  key={formattedName}
                                  value={category}
                                >
                                  {formattedName}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category?.message && (
                    <FieldDescription className="text-red-500 text-balance">
                      {errors.category.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Type</FieldLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(Media_Type).map((type) => {
                              const formattedName = type
                                .replace(/_/g, " ") // Replace underscores with spaces
                                .toLowerCase() // Make it all lowercase
                                .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
                              return (
                                <SelectItem key={formattedName} value={type}>
                                  {formattedName}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.type.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Alt Text</FieldLabel>
                  <Textarea
                    placeholder="Type your message here."
                    {...register("altText")}
                  />
                  {errors.altText?.message && (
                    <FieldDescription className="text-red-500">
                      {errors.altText.message}
                    </FieldDescription>
                  )}
                </Field>
                <div className="flex flex-row gap-2 justify-between h-9">
                  <Button
                    className="hover:bg-red-300 font-bold rounded-lg flex-1 h-full"
                    variant="destructive"
                    disabled={isSubmitting}
                    type="button"
                    onClick={async () => {
                      try {
                        await fetch("/api/mediacleanup", {
                          method: "POST",
                          body: JSON.stringify({
                            id: previewImage?.split("/f/")[1],
                          }),
                        });
                      } catch (error) {
                        console.log(`Error while canceling upload: ${error}`);
                      }
                      reset();
                      setPreviewImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold flex-1 rounded-lg h-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </div>
        ) : (
          <div className="w-3/5 ">
            <UploadDropzone
              endpoint="groceryMedia"
              onClientUploadComplete={(res) => {
                if (res) {
                  setPreviewImage(res[0]?.ufsUrl);
                  setValue("url", res[0]?.ufsUrl, { shouldValidate: true });
                }
              }}
              onUploadError={(error) => {
                console.log(error);
              }}
              appearance={{
                button:
                  "bg-gray-600 hover:bg-gray-700 text-white font-bold px-3",
                label: "text-gray-600",
                allowedContent: "text-gray-500",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
