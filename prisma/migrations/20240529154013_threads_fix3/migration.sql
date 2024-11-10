/*
  Warnings:

  - Changed the type of `updated_by` on the `threads` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "threads" DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER NOT NULL;
