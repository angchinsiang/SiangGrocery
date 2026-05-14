import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import LikeCommentButton from "../LikeCommentButton";
import { CommentWithUser } from "../Comments";
import LikeCommentButton2 from "./LikeCommentButton2";

const Comment = ({
  SKU,
  comment: {
    rating,
    createdAt,
    user: { name, image_url },
    commentLikes,
    _count,
    comment: commentText,
    id: commentId,
  },
}: {
  SKU: string;
  comment: CommentWithUser;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        <Avatar>
          <AvatarImage
            src={image_url || "https://github.com/shadcn.png"}
            alt={name}
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-col">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">
              {createdAt.toDateString()}
            </p>
          </div>
        </div>
        <p className="text-xs">{"⭐".repeat(rating)}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm">{commentText}</p>
        <div className="flex justify-end">
          <LikeCommentButton2
          SKU={SKU}
            hasLiked={commentLikes.length > 0}
            likeCount={_count.commentLikes}
            commentId={commentId}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;
