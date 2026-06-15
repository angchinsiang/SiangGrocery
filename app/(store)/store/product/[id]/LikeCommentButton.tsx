"use client";

import { updateLike } from "@/actions/uploadLike";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";

const LikeCommentButton = ({
  hasLiked,
  likeCount,
  commentId,
}: {
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

  const handleLike = async () => {
    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }
    try {
      startTransition(async () => {
        setOptimisticCommentLike(undefined);
        await updateLike({
          commentId: commentId,
          pathname: pathname,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button variant="ghost" disabled={isPending} onClick={handleLike}>
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

export default LikeCommentButton;
