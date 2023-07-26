-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "like" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retweet" BOOLEAN NOT NULL DEFAULT false;
