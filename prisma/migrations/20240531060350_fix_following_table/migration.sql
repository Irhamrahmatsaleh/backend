/*
  Warnings:

  - You are about to drop the column `thread_id` on the `following` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `following` table. All the data in the column will be lost.
  - Added the required column `followed_id` to the `following` table without a default value. This is not possible if the table is not empty.
  - Added the required column `follower_id` to the `following` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "FK_4a5bd9db5bd73571f8c45717718";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "FK_4fdfeb1ef6cdf3e0a6170a57b3b";

-- AlterTable
ALTER TABLE "following" DROP COLUMN "thread_id",
DROP COLUMN "user_id",
ADD COLUMN     "followed_id" INTEGER NOT NULL,
ADD COLUMN     "follower_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "FK_4a5bd9db5bd73571f8c45717718" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "FK_4fdfeb1ef6cdf3e0a6170a57b3b" FOREIGN KEY ("follower_id") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
