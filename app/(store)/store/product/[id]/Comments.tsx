import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import LikeCommentButton from "./LikeCommentButton";

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: { name: true; id: true };
    };
    _count: { select: { commentLikes: true } };
    commentLikes: true;
  };
}>;

const Comments = async ({
  comments,
  SKU,
}: {
  comments: CommentWithUser[];
  SKU: string;
}) => {
  const commentCount = await prisma.comment.aggregate({
    where: { SKU: SKU },
    _count: { id: true },
  });
  const sessionUser = await currentUser();
  const userImage = sessionUser?.imageUrl || "https://github.com/shadcn.png";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 justify-between">
        <p className="font-bold text-xl">Comments ({commentCount._count.id})</p>
        <Button variant="link" className="text-muted-foreground">
          Read More
        </Button>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-muted-foreground">
              Filter By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Newest</DropdownMenuLabel>
              <DropdownMenuItem>Oldest</DropdownMenuItem>
              <DropdownMenuItem>Highest Rating</DropdownMenuItem>
              <DropdownMenuItem>Lowest Rating</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>5 Stars</DropdownMenuItem>
            <DropdownMenuItem>4 Stars</DropdownMenuItem>
            <DropdownMenuItem>3 Stars</DropdownMenuItem>
            <DropdownMenuItem>2 Stars</DropdownMenuItem>
            <DropdownMenuItem>1 Star</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      {comments.map((c) => (
        <div className="flex flex-col gap-2" key={c.id}>
          <div className="flex gap-1.5">
            <Avatar>
              <AvatarImage src={userImage} alt={c.user.name} />
              <AvatarFallback>{c.user.name}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-col">
                <p className="font-medium text-sm">{c.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.createdAt.toDateString()}
                </p>
              </div>
            </div>
            <p className="text-xs">{"⭐".repeat(c.rating)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm">{c.comment}</p>
            <div className="flex justify-end">
              <LikeCommentButton
                commentLike={c.commentLikes}
                likeCount={c._count.commentLikes}
                commentId={c.id}
              />
            </div>
          </div>
        </div>
      ))}
      {/* {comments.map((c) => 
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <Avatar>
              <AvatarImage
                src={userImage}
                alt={c.user.name}
                className="grayscale"
              />
              <AvatarFallback>{c.user.name}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-col">
                <p className="font-medium text-sm">User Name</p>
                <p className="text-xs text-muted-foreground">2025-10-10</p>
              </div>
            </div>
            <p className="text-xs">{"⭐".repeat(c.rating)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm">
              &quot;I&apos;m very picky about my meat, but the ribeye I ordered
              from SiangGrocery was restaurant-quality. You can tell they
              actually care about the product condition during delivery&mdash;it
              arrived perfectly vacuum-sealed and still chilled. Finally, a
              grocery site that delivers on its promises!&quot;
            </p>
            <div className="flex justify-end">
              <Button variant="link">
                Likes <BiLike />
              </Button>
            </div>
          </div>
        </div>;
      )} */}
    </div>
  );
};

export default Comments;
