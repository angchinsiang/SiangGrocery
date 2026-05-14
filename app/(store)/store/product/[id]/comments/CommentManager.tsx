"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { infiniteComment } from "@/actions/infiniteComment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Comment from "./Comment";

const CommentManager = ({ SKU }: { SKU: string }) => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", SKU],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      infiniteComment({ SKU, cursor: pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const flatData = data?.pages.flatMap((page) => page.comments) || [];
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-4/5 flex flex-col gap-8">
      {isError ? (
        <p className="text-red-500">Error fetching comments</p>
      ) : isLoading ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[250px]" />
          ))}
        </div>
      ) : (
        flatData.map((comment) => (
          <Comment key={comment.id} comment={comment} SKU={SKU} />
        ))
      )}
      <div ref={ref} className="py-4 text-center italic text-muted-foreground">
        {isFetchingNextPage ? <Spinner className="size-4" /> : ""}
      </div>
    </div>
  );
};

export default CommentManager;
