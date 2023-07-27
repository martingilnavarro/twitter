/*
  Warnings:

  - You are about to drop the column `postCommentedId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postCommentedId",
ADD COLUMN     "comment" BOOLEAN NOT NULL DEFAULT false;
