-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "update_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,

    CONSTRAINT "PK_c76c6e044bdf76ecf8bfb82a645" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "created_by" VARCHAR NOT NULL,
    "update_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_by" VARCHAR NOT NULL,

    CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "image" VARCHAR NOT NULL,
    "content" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "created_by" VARCHAR NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_by" VARCHAR NOT NULL,

    CONSTRAINT "PK_08f619ebe431e27e9d206bea132" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threads" (
    "id" SERIAL NOT NULL,
    "image" VARCHAR NOT NULL,
    "content" VARCHAR,
    "number_of_replies" INTEGER NOT NULL,
    "updatedBy" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "update_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "created_by" INTEGER,
    "createdBy" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_d8a74804c34fc3900502cd27275" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR,
    "full_name" VARCHAR,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "photo_profile" VARCHAR,
    "bio" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "created_by" VARCHAR NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_by" VARCHAR NOT NULL,

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fe0bb3f6520ee0469504521e710" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_97672ac88f789774dd47f7c8be3" ON "users"("email");

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "FK_4a5bd9db5bd73571f8c45717718" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "FK_4fdfeb1ef6cdf3e0a6170a57b3b" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "FK_dfee0c14f2a697eeb0b0bfc50cc" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "FK_1af58ca9000874da2171004d164" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "FK_c961efa3687d100ed22cd409534" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "FK_d8d74bcfa3ef439fa3742445e28" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
