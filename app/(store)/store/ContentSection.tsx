import dummyImg from "@/public/DummyImg.jpg";
import StoreProductCard from "./StoreProductCard";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const latestMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const popularThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const popularGroceries = await prisma.grocery_Order.groupBy({
  _sum: { quantity: true },
  by: ["lp_id"],
  where: {
    order_ticket: {
      completed_At: { gte: popularThreshold },
      status: "COMPLETED",
    },
  },
  orderBy: { _sum: { quantity: "desc" } },
  take: 8,
});
const popular_ids = popularGroceries.map((item) => {
  return item.lp_id;
});

const whereClause: Record<sectionTitle, object> = {
  Promotions: {
    where: { isPromotion: true, status: true },
  },
  "New Arrivals": {
    where: { createdAt: { gte: latestMonth }, status: true },
  },
  "Currently Popular": {
    where: { id: { in: popular_ids }, status: true },
  },
};
type sectionTitle = "Promotions" | "New Arrivals" | "Currently Popular";

const ContentSection = async ({ title }: { title: sectionTitle }) => {
  const groceryFetching = async () => {
    try {
      return await prisma.grocery.findMany({
        ...whereClause[title],
        include: {
          groceryMedias: {
            include: {
              media: { select: { url: true } },
            },
            where: { media: { status: "ACTIVE", type: "IMAGE" } },
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          listedProducts: {
            select: {
              original_price: true,
              discount_price: true,
              total_qty: true,
              reserved_qty: true,
              locked_in_qty: true,
            },
            where: { isDisplay: true },
          },
        },
        take: 8,
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const groceries = await groceryFetching();
  return (
    groceries.length > 0 && (
      <div className="space-y-5 ">
        <div className="flex justify-between">
          <p className="text-2xl font-bold">{title}</p>
          <Button variant="link">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {groceries.map((grocery) => (
            <StoreProductCard
              key={grocery.id}
              SKU={grocery.id}
              alt={grocery.name}
              image={grocery.groceryMedias[0]?.media.url || dummyImg}
              price={grocery.listedProducts[0]?.discount_price}
              oriPrice={grocery.listedProducts[0]?.original_price}
              unit={grocery.MoU.toString()}
              country={grocery.country}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default ContentSection;
