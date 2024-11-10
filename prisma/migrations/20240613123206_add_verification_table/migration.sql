-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('FORGOT_PASSWORD', 'EMAIL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "verifications" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL DEFAULT 'EMAIL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verifications_token_key" ON "verifications"("token");
