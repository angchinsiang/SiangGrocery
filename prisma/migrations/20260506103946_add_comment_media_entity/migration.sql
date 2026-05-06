-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "media" SET NOT NULL,
ALTER COLUMN "media" DROP DEFAULT,
ALTER COLUMN "media" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Comment_Media" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "Media_Type" NOT NULL,
    "status" "Comment_Status" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_Media_comment_id_url_key" ON "Comment_Media"("comment_id", "url");

-- AddForeignKey
ALTER TABLE "Comment_Media" ADD CONSTRAINT "Comment_Media_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
