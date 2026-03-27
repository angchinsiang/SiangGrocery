import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import BodyTemplate from "@/app/Components/BodyTemplate";
import { Switch } from "@/components/ui/switch";
import { FaChevronRight } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const page = async () => {
  const sessionUser = await currentUser();
  const image = sessionUser?.imageUrl || "https://github.com/shadcn.png";
  let name = "New User";
  if (sessionUser?.id) {
    const userInDb = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });
    name = userInDb?.name || "New User";
  }
  return (
    <BodyTemplate>
      <div>
        <div className="flex flex-col items-center gap-1">
          <Avatar size="lg">
            <AvatarImage src={image} />
            <AvatarFallback>
              <Avatar className="size-7"></Avatar>
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-1 items-center">
            <p className="font-bold text-lg">{name}</p>
            <Button variant="ghost">
              <FaRegEdit className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-10 flex flex-col">
        <div className="flex justify-between py-3">
          <div className="font-semibold text-md">Themes</div>
          <div>
            <Switch id="switch-focus-mode" />
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            className="flex justify-between text-md p-0 w-full py-6"
          >
            <div className="font-semibold text-md">Address</div>
            <FaChevronRight className="size-3" />
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            className="flex justify-between text-md p-0 w-full py-6"
          >
            <div className="font-semibold text-md">Change Password</div>
            <FaChevronRight className="size-3" />
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            className="flex gap-2 justify-start text-md p-0 w-full py-6"
          >
            <div className="font-semibold text-md text-red-500">Log Out</div>
            <IoExitOutline className="size-5 text-red-500" />
          </Button>
        </div>
      </div>
    </BodyTemplate>
  );
};
export default page;
