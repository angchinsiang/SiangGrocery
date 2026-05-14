"use client";

import { updateLike } from "@/actions/uploadLike";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";

const LikeCommentButton2 = ({
  SKU,
  hasLiked,
  likeCount,
  commentId,
}: {
  SKU: string;
  hasLiked: boolean;
  likeCount: number;
  commentId: string;
}) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [optimisticCommentLike, setOptimisticCommentLike] = useOptimistic(
    hasLiked,
    (prev) => !prev,
  );

  const queryClient = useQueryClient();
  const likeActionUpdate = useMutation({
    mutationFn: async () => {
      return await handleLike();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", SKU],
      });
    },
  });

  const handleLike = async () => {
    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }
    try {
      startTransition(async () => {
        setOptimisticCommentLike(undefined);
        await updateLike({
          commentId: commentId,
          userId: userId,
          pathname: pathname,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={() => likeActionUpdate.mutate()}
    >
      {optimisticCommentLike ? (
        <>
          <BiSolidLike />({likeCount})
        </>
      ) : (
        <>
          <BiLike />({likeCount})
        </>
      )}
    </Button>
  );
};

export default LikeCommentButton2;
