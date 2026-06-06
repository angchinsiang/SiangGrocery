import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BodyTemplate from "@/components/server/BodyTemplate";
import MoreSection from "@/components/server/MoreSection";
import Comments from "./Comments";
import DescriptionSection from "./DescriptionSection";
import ProductImageAndPrice from "./ProductImage&Price";
import { getGrocery } from "@/actions/product-details/getGrocery";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@clerk/nextjs/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getWishlistStatus } from "@/actions/wishlist-bundle/getWishlistStatus";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const SKU = (await params).id;
  const grocery_media = await prisma.grocery_Media.findFirst({
    where: { SKU: SKU, media: { type: "IMAGE", status: "ACTIVE" } },
    include: {
      grocery: {
        select: { name: true, description: true },
      },
      media: {
        select: { url: true },
      },
    },
    orderBy: { sortOrder: "asc" },
    take: 1,
  });

  return {
    title: `SiangGrocery - ${grocery_media?.grocery.name}` || "SiangGrocery",
    description: grocery_media?.grocery.description,
    openGraph: {
      title: `SiangGrocery - ${grocery_media?.grocery.name}` || "SiangGrocery",
      description: grocery_media?.grocery.description,
      url: `http://localhost:3000/store/product/${SKU}`,
      type: "website",
      images: [
        { url: grocery_media?.media.url || "", width: 800, height: 600 },
      ],
    },
    twitter: {
      title: grocery_media?.grocery.name || "SiangGrocery",
      description: grocery_media?.grocery.description,
      images: [grocery_media?.media.url || ""],
    },
  };
}

// console.log(`\n\n${JSON.stringify(grocery_media, null, 2)}\n\n`);
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: SKU } = await params;
  const { userId } = await auth();
  const grocery = await getGrocery({ SKU });

  // console.log(`\n\n${JSON.stringify(grocery, null, 2)}\n\n`);
  if (!grocery) notFound();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["wishlist"],
    queryFn: () => (userId ? getWishlistStatus({ userId }) : []),
    staleTime: Infinity,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BodyTemplate className="pt-1">
        <ProductImageAndPrice
          SKU={SKU}
          name={grocery.name}
          originalPrice={grocery.listedProducts[0]?.original_price || 99999}
          discountPrice={grocery.listedProducts[0]?.discount_price || 99999}
          MoU={grocery.MoU}
        />
        <div className="w-[50%] flex flex-col gap-10">
          <Suspense
            fallback={Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          >
            <DescriptionSection
              SKU={SKU}
              description={grocery.description}
              name={grocery.name}
              userId={userId}
            />
          </Suspense>
          <Comments SKU={SKU} />
        </div>
        <MoreSection />
      </BodyTemplate>
    </HydrationBoundary>
  );
};

export const revalidate = 60;

export default page;
