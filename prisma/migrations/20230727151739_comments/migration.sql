-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postCommentedId" UUID;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postCommentedId_fkey" FOREIGN KEY ("postCommentedId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
