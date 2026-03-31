import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  groceryMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    video: { maxFileSize: "128MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized - Not logged in");

      // const isAdmin = await prisma.admin.findUnique({
      //   where: { id: user.userId || "" },
      // });
      // if (!isAdmin) throw new UploadThingError("Unauthorized - Not an admin");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileKey = file.ufsUrl.split("/f/")[1];
      try {
        await prisma.mediaAsset.create({
          data: {
            id: fileKey,
            url: file.ufsUrl,
            name: file.name,
            category: "OTHER",
            type: "IMAGE",
            altText: "This is a draft.",
            status: "DRAFT",
          },
        });
      } catch (error) {
        console.log(`Error uploading media asset: ${error}`);
        throw new Error("Failed to upload media asset");
      }

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
