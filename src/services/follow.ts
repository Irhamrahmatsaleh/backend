import { Prisma, PrismaClient } from "@prisma/client";
import { UserJWTPayload } from "../types/payload";
import { number } from "joi";
import { following, users } from "../dto/user";

class followServices {
    private prisma : PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async followingList(user : UserJWTPayload){
        try{
            const followed = await this.prisma.following.findMany({
                where: {
                  follower_id: user.id,
                },
                include:{
                    followed: true
                }
              });
            return followed;
        } catch(err) {
            throw new Error(err);
        }
    }

    async followerList(user : UserJWTPayload,){
        try{
            const follower = await this.prisma.following.findMany({
                where:{
                    followed_id: user.id
                },
                include:{
                    follower: true
                }
            });
            return follower
        } catch(err) {
            throw new Error(err);
        }
    }

    async suggestedUser(user : UserJWTPayload, limit : number){
        try {
            const userCount = await this.prisma.following.count();
            const skip =  Math.floor(Math.random() * Math.max(userCount - limit, 0));

            const users : any[]= await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM users ORDER BY RANDOM() LIMIT ${limit}`)

            users.forEach((item) => {
                delete item.password;
            })

            const followed = await this.prisma.following.findMany({
                where: {
                    follower_id: user.id,
                },
            });
            
            const followedUser = new Set(followed.map(f => f.followed_id));
            const usersArr = users.filter(userData => userData.id !== user.id)
            .map(userData => {
                const isFollowed = followedUser.has(userData.id);
                return { ...userData, isFollowed };
            });
            return usersArr;
        } catch(err) {
            throw new Error(err);
        }
    }

    async searchedUsers(word : string, thisUser : UserJWTPayload){
        try {
            let users : users[];
            if(word[0] === '@')
                {
                    users = await this.prisma.users.findMany({
                        where: {
                            username: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        }
                    })
                } else {
                    users = await this.prisma.users.findMany({
                        where: {
                            full_name: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        }
                    })
                }
                users.forEach((item) => {
                    delete item.password;
                })

                const followed = await this.prisma.following.findMany({
                    where: {
                        follower_id: thisUser.id,
                    },
                });

                const followedUserIds = new Set(followed.map(f => f.followed_id));

                const usersArr = users.filter(user => user.id !== thisUser.id)
                .map(user => {
                    const isFollowed = followedUserIds.has(user.id);
                    return { ...user, isFollowed };
                });

            return(usersArr);
        } catch (err) {
            throw new Error(err);
        }
    }

    async setFollow(idFollowed : number, idUser : number){
        try {
        if (idFollowed === idUser) throw new Error("Cannot follow your own account");

        const followedData = await this.prisma.following.findMany({
            where : {
              follower_id: idUser,
              followed_id: idFollowed,
            }
          })

        if(followedData.length > 0) throw new Error("User already been followed");

        const followData = await this.prisma.following.create({
        data : {
            follower_id: idUser,
            followed_id: idFollowed,
        }
        })
          return followData;
        } catch(err){
          throw new Error(err);
        }
      }

      async setUnfollow(idFollowed : number, idUser : number){
        try {
            if (idFollowed === idUser) throw new Error("Cannot unfollow your own account");
          const unfollowData = await this.prisma.following.deleteMany({
            where : {
              follower_id: idUser,
              followed_id: idFollowed,
            }
          })
          if(unfollowData.count < 1) throw new Error("Account already been unfollowed");
          return unfollowData;
        } catch(err){
          throw new Error(err);
        }
      }
}

export default new followServices();