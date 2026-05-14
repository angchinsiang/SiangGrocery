import BodyTemplate from "@/components/server/BodyTemplate";
import GoUp from "@/components/client/GoUp";
import prisma from "@/lib/prisma";
import CommentManager from "./CommentManager";

const CommentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const SKU = (await params).id;

  const avgRating = await prisma.comment.aggregate({
    where: {
      SKU: SKU,
    },
    _avg: { rating: true },
  });

  return (
    <BodyTemplate>
      <div className="fixed z-99 text-xl font-bold right-5">
        {avgRating._avg.rating?.toFixed(1) || 0} ⭐⭐⭐⭐⭐
      </div>
      <CommentManager SKU={SKU} />
      <GoUp />
    </BodyTemplate>
  );
};

export default CommentPage;
