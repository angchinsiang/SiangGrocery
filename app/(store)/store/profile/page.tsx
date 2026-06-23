import BodyTemplate from "@/components/server/BodyTemplate";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

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
      <ProfileClient initialName={name} image={image} />
    </BodyTemplate>
  );
};
export default page;
