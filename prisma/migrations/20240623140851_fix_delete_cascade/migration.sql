-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "FK_dfee0c14f2a697eeb0b0bfc50cc";

-- DropForeignKey
ALTER TABLE "likesreplies" DROP CONSTRAINT "likesreplies_reply_id_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "FK_1af58ca9000874da2171004d164";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "FK_dfee0c14f2a697eeb0b0bfc50cc" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likesreplies" ADD CONSTRAINT "likesreplies_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "FK_1af58ca9000874da2171004d164" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
