/*
  Warnings:

  - You are about to drop the `migrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "FK_4fdfeb1ef6cdf3e0a6170a57b3b";

-- DropTable
DROP TABLE "migrations";

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "FK_4fdfeb1ef6cdf3e0a6170a57b3b" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
