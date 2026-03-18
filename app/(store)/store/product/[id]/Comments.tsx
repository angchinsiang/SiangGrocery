import { Button } from "@/components/ui/button";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiLike } from "react-icons/bi";

const Comments = () => {
  const count = 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 justify-between">
        <p className="font-bold text-xl">Comments ({count})</p>
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
      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-col">
              <p className="font-medium text-sm">User Name</p>
              <p className="text-xs text-muted-foreground">2025-10-10</p>
            </div>
          </div>
          <p className="text-xs">⭐⭐⭐⭐⭐</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm">
            &quot;I&apos;m very picky about my meat, but the ribeye I ordered
            from SiangGrocery was restaurant-quality. You can tell they actually
            care about the product condition during delivery&mdash;it arrived
            perfectly vacuum-sealed and still chilled. Finally, a grocery site
            that delivers on its promises!&quot;
          </p>
          <div className="flex justify-end">
            <Button variant="link">
              Likes <BiLike />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
