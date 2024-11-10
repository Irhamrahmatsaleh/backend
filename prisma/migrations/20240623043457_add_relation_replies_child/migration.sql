/*
  Warnings:

  - A unique constraint covering the columns `[parent_id]` on the table `replies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "replies_parent_id_key" ON "replies"("parent_id");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
