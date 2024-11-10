import { following } from "@prisma/client";

export type UserJWTPayload = {
    id: number;
    username: string;
    fullName: string;
    email: string;
    photoProfile: string;
    bio: string;
    follower: following[],
    following: following[]
  };