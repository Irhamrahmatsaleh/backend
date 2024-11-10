/*
  Warnings:

  - The `created_by` column on the `likes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_by` column on the `likes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_by` column on the `replies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_by` column on the `replies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "likes" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER,
DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER,
DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER;
