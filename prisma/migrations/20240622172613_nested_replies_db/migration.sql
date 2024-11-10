-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "parent_id" INTEGER;

-- CreateTable
CREATE TABLE "likesreplies" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reply_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "created_by" INTEGER,
    "update_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_by" INTEGER,

    CONSTRAINT "likesreplies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likesreplies" ADD CONSTRAINT "likesreplies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likesreplies" ADD CONSTRAINT "likesreplies_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
