import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Guest from "@/public/Guest.jpg";

const Comments = () => {
  const comments = [
    {
      name: "John Doe",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "I was skeptical about ordering leafy greens online, but SiangGrocery surprised me. The spinach and bok choy arrived crisp and cold, as if I had picked them out myself. This is easily the best quality I've seen in the city!",
    },
    {
      name: "John Doe2",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "I was skeptical about ordering leafy greens online, but SiangGrocery surprised me. The spinach and bok choy arrived crisp and cold, as if I had picked them out myself. This is easily the best quality I've seen in the city!",
    },
    {
      name: "John Doe3",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "I was skeptical about ordering leafy greens online, but SiangGrocery surprised me. The spinach and bok choy arrived crisp and cold, as if I had picked them out myself. This is easily the best quality I've seen in the city!",
    },
    {
      name: "John Doe4",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "I was skeptical about ordering leafy greens online, but SiangGrocery surprised me. The spinach and bok choy arrived crisp and cold, as if I had picked them out myself. This is easily the best quality I've seen in the city!",
    },
  ];

  return (
    <div className="w-3/5 flex flex-col items-center gap-5 mt-8">
      <div className="text-4xl font-bold">Your Voice, Our Vision</div>
      <p className="text-center">
        Quality service starts with a conversation. We value every piece of
        feedback—from a quick &quot;thank you&quot; to a detailed suggestion on
        how we can better handle your deliveries. Your insights help us maintain
        our high standards and ensure every SiangGrocery experience is better
        than the last.
      </p>
      <div className="w-full ">
        <Carousel className="">
          <CarouselContent className="-ml-2 p-2">
            {comments.map((comment) => (
              <CarouselItem
                key={comment.name}
                className="lg:basis-1/2 basis-full pl-4"
              >
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center px-10">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="lg">
                        <AvatarImage
                          src={Guest.src}
                          alt="@shadcn"
                          className="grayscale"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p>{comment.name}</p>
                      <p>{comment.rating}</p>
                      <p>{comment.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default Comments;
