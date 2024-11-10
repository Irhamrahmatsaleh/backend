-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "number_of_replies" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "updated_by" DROP NOT NULL;
