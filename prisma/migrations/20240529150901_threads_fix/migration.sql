-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "number_of_replies" SET DEFAULT 0;
