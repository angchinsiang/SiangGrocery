import PriceTag from "@/app/Components/PriceTag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import Link from "next/link";

const ProductImageAndPrice = async ({
  SKU,
  name,
  originalPrice: oriPrice,
  discountPrice: price,
  MoU,
}: {
  SKU: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  MoU: string;
}) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalUnitSold = await prisma.grocery_Order.aggregate({
    _sum: { quantity: true },
    where: {
      listed_product: {
        SKU: SKU,
      },
      order_ticket: { createdAt: { gte: thirtyDaysAgo }, status: "COMPLETED" },
    },
  });

  const remainingUnits = await prisma.listed_Product.aggregate({
    _sum: { total_qty: true },
    where: { SKU: SKU, isDisplay: true },
  });

  return (
    <div className="flex">
      <div className="w-[50%] aspect-video [&_div]:size-full">
        <Carousel className="size-full ">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-[50%] py-1">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-3xl font-normal">{name}</p>
              <div className="flex items-center gap-2.5">
                <span className="text-xs">
                  {totalUnitSold._sum.quantity || 0} sold
                </span>
                <Separator orientation="vertical" className="bg-black" />
                <span className="text-xs">
                  {remainingUnits._sum.total_qty || 0} left
                </span>
              </div>
            </div>
            <div>
              <PriceTag oriPrice={oriPrice} price={price} unit={MoU} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Blue
            </Badge>
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
              Yellow
            </Badge>
            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              Red
            </Badge>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex flex-col gap-3 px-20">
          {(remainingUnits?._sum.total_qty || 0) > 0 ? (
            <>
              <Button
                variant="destructive"
                className="py-4.5 font-semibold text-base shadow-lg/5 border-red-200 "
              >
                Check Out
              </Button>
              <Button className=" bg-blue-600 text-white hover:bg-blue-700 py-4.5 text-base shadow-lg border-none ">
                Add to Cart
              </Button>
            </>
          ) : (
            <div className="flex justify-center p-1 font-bold text-xl text-red-600 ">
              Out of Stock
            </div>
          )}
          <Button
            variant="link"
            asChild
            className=" w-fit self-center underline hover:font-bold"
          >
            <Link href="/store/chat">Chat with Seller</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageAndPrice;
