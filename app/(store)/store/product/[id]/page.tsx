import BodyTemplate from "@/app/Components/BodyTemplate";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MoreSection from "../../../../Components/MoreSection";
import Comments from "./Comments";
import DescriptionSection from "./DescriptionSection";
import ProductImageAndPrice from "./ProductImage&Price";
import { unstable_cache } from "next/cache";
import { getGrocery } from "@/actions/product-details/getGrocery";

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
  const grocery = await getGrocery({ SKU });

  // console.log(`\n\n${JSON.stringify(grocery, null, 2)}\n\n`);
  if (!grocery) notFound();

  return (
    <BodyTemplate className="pt-1">
      <ProductImageAndPrice
        SKU={SKU}
        name={grocery.name}
        originalPrice={grocery.listedProducts[0]?.original_price || 99999}
        discountPrice={grocery.listedProducts[0]?.discount_price || 99999}
        MoU={grocery.MoU}
      />
      <div className="w-[50%] flex flex-col gap-10">
        <DescriptionSection
          SKU={SKU}
          description={grocery.description}
          name={grocery.name}
        />
        <Comments SKU={SKU} />
      </div>
      <MoreSection />
    </BodyTemplate>
  );
};

export const revalidate = 60;

export default page;
