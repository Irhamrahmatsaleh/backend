/*
  Warnings:

  - You are about to drop the column `createdAt` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `verifications` table. All the data in the column will be lost.
  - The `type` column on the `verifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "verifications" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'EMAIL';

-- DropEnum
DROP TYPE "VerificationType";
