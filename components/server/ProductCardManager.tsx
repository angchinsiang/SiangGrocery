"use client";
import { infiniteGrocery } from "@/actions/more-section/infiniteGrocery";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import StoreProductCard from "./StoreProductCard";
import dummyImage from "@/public/DummyImg.jpg";
import { useInView } from "react-intersection-observer";
import { Spinner } from "../ui/spinner";

const ProductCardManager = () => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["more-section"],
    queryFn: ({ pageParam }: { pageParam?: string | undefined }) => {
      return infiniteGrocery({ cursor: pageParam });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    retry: 3,
  });

  const flatData = data?.pages.flatMap((page) => page.groceries) ?? [];
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-5 pb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {isError ? (
          <div className="col-span-full flex justify-center text-red-600 font-medium ">
            error
          </div>
        ) : isLoading ? (
          <div className="col-span-full flex justify-center">loading...</div>
        ) : (
          flatData.map((grocery) => (
            <StoreProductCard
              key={grocery?.id}
              alt={grocery?.groceryMedias[0]?.media.altText || "image"}
              image={grocery?.groceryMedias[0]?.media.url || dummyImage}
              price={grocery?.listedProducts[0]?.discount_price || 99999}
              oriPrice={grocery?.listedProducts[0]?.original_price || 99999}
              unit={grocery?.MoU || ""}
              country={grocery?.country || ""}
              SKU={grocery?.id || ""}
            />
          ))
        )}
      </div>
      <div className="flex justify-center py-10" ref={ref}>
        {hasNextPage && <Spinner className="size-5" />}
      </div>
    </div>
  );
};

export default ProductCardManager;
