/*
  Warnings:

  - You are about to drop the column `createdBy` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `threads` table. All the data in the column will be lost.
  - Added the required column `updated_by` to the `threads` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_by` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "threads" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "updated_by" VARCHAR NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL;
