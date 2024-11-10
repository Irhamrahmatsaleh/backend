import { PrismaClient } from "@prisma/client"
import Bcrypt from 'bcrypt'
import { editProfileSchema, editProfileValidate, loginSchema, loginValidate, registerSchema, registerValidate } from "../dto/user";
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import user from "../controllers/user";


 class userService {
    private prisma : PrismaClient;
    private saltRound : number;
    constructor()
    {
        this.saltRound= 10;
        this.prisma = new PrismaClient();
    }

    async FindUser(userID : number){
      try {
        const fetchedData = await this.prisma.users.findUnique({
          where: {id: userID},
          select: {
            photo_profile: true,
            full_name: true,
            username: true,
            bio: true,
            follower: true,
            following : true,
          }
        })

        const data = {
          photo_profile: fetchedData.photo_profile,
          full_name: fetchedData.full_name,
          username: fetchedData.username,
          bio: fetchedData.bio,
          follower: fetchedData.follower.length,
          following : fetchedData.following.length,
        }
        if(!fetchedData) throw new Error ("User not found");
         return data;
      } catch(err) {
        throw new Error(err);
      }
    }

    async FindOtherUser(userID : number, currentUserID : number){
      try {
        const fetchedData = await this.prisma.users.findUnique({
          where: {id: userID},
          select: {
            id: true,
            photo_profile: true,
            full_name: true,
            username: true,
            bio: true,
            follower: true,
            following : true,
          }
        })

        const data = {
          id : fetchedData.id,
          photo_profile: fetchedData.photo_profile,
          full_name: fetchedData.full_name,
          username: fetchedData.username,
          bio: fetchedData.bio,
          follower: fetchedData.follower.length,
          following : fetchedData.following.length,
        }
        if(!fetchedData) throw new Error ("User not found");

        const followed = await this.prisma.following.findMany({
          where: {
              follower_id: currentUserID,
          },
        });

        const followedUserIds = new Set(followed.map(f => f.followed_id));
        const isFollowed = followedUserIds.has(userID);
         return {...data, isFollowed};
      } catch(err) {
        throw new Error(err);
      }
    }

    async RegisterUser(dto : registerSchema) {
        try {
            const validate = registerValidate.validate(dto);
        
            if (validate.error) {
              throw new Error(JSON.stringify(validate.error));
            }

            if(!dto.email)
                {
                    throw new Error("Email empty");
                }
            if(!dto.password)
                {
                    throw new Error ("Password empty");
                }

            const hashedPassword = await new Promise<string>((resolve, reject) => {
                Bcrypt.hash(dto.password, this.saltRound, async function(err, hash) {
                    if (err)
                        {
                            reject(new Error("error hashing"));
                        } else {
                            resolve(hash);
                        }
                    });
            });

            const email = await this.prisma.users.findUnique({
              where:{
                email: dto.email
              }
            })

            if(email) throw new Error ("Email already registered");

            const createdData = await this.prisma.users.create({ 
                data: {
                    full_name: dto.full_name,
                    email : dto.email,
                    password : hashedPassword,
                    created_by: dto.full_name,
                    updated_by: dto.full_name
                }
            });
            if(!createdData) throw new Error("error create data");
            return createdData;
        } catch (err)
        {
            throw new Error(err);
        }
    }

    async createVerification(token: string, type: string) {
        try {
          return await this.prisma.verification.create({
            data: {
              token,
              type,
            },
          });
        } catch (error) {
          throw new Error(error.message || "Failed to retrieve users");
        }
      }

    async verify(token: string) {
        try {
          // pakek cara, kita bikin table baru untuk khusus nyimpan tokennya, lalu cocokkan
          const verification = await this.prisma.verification.findUnique({
            where: { token },
          });
      
          const userId = jwt.verify(verification.token, process.env.JWT_SECRET);
      
          if (verification.type === "FORGOT_PASSWORD") {
            return;
          }
      
          return await this.prisma.users.update({
            data: {
              isverified: true,
            },
            where: {
              id: Number(userId),
            },
          });
        } catch (error) {
          throw new Error(error.message || "Failed to verify email");
        }
      }

    async LoginUser(dto : loginSchema){
        try {
            
            const validate = loginValidate.validate(dto);
        
            if (validate.error) {
              throw new Error(JSON.stringify(validate.error));
            }
        
            const user = await this.prisma.users.findUnique({
              where: {
                email: dto.email,
              },
            });
        
            if (!user) throw new Error("User not found!");
            if(!user.isverified) throw new Error("User not verified!");
        
            const isValidPassword = await Bcrypt.compare(dto.password, user.password);
        
            if (!isValidPassword) throw new Error("Password Invalid");
        
            delete user.password;
        
            const jwtSecret = process.env.JWT_SECRET;
        
            const token = jwt.sign(user, jwtSecret);
        
            return { token, user };
          } catch (err) {
            throw new Error(err);
          }
    }

    async UpdateProfile(idUser : number,dto : editProfileSchema){
        // const hashedPassword = await new Promise<string>((resolve, reject) => {
        //     Bcrypt.hash(dto.password, this.saltRound, async function(err, hash) {
        //         if (err)
        //             {
        //                reject(new Error(err));
        //             } else {
        //                 resolve(hash);
        //             }
        //         });
        //     });
          const validate = editProfileValidate.validate(dto);
          
          if (validate.error) {
            throw new Error(JSON.stringify(validate.error));
          }

          let imageUrl = null;
          if (dto.photo_profile) {
            const upload = await cloudinary.uploader.upload(dto.photo_profile, {
                upload_preset: "threads"
            });
            imageUrl = upload.secure_url;
          }

          if(dto.username[0] !== '@') dto.username = '@' + dto.username;

          let data : any;
          if(dto.photo_profile)
            {
              data = {
                full_name: dto.full_name,
                username: dto.username,
                bio: dto.bio,
                photo_profile: imageUrl,
                updated_by: dto.full_name
              }
            } else {
              data = {
                full_name: dto.full_name,
                username: dto.username,
                bio: dto.bio,
                updated_by: dto.full_name
              }
            }
    
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if(!data[key]) delete data[key];
                }
            }

          try {
            const validate = editProfileValidate.validate(dto);
        
            if (validate.error) {
              throw new Error(JSON.stringify(validate.error));
            }

            const dataUpdate = await this.prisma.users.update(
                {
                    where: { id : idUser},
                    data: {...data}
                });
            if(!dataUpdate) throw new Error("error update data");
            delete dataUpdate.password;
            return dataUpdate;
        } catch (err) {
            throw new Error(err);
        }
    }

    async DeleteUser(idUser : number)
    {
        try {
            const deletedData = await this.prisma.users.delete({
                where: {
                    id : idUser
                }
            })
            delete deletedData.password;
            return deletedData;
        } catch (err)
        {
            throw new Error(err);
        }
    }

    async checkEmail(userEmail:string){
      try {
        return await this.prisma.users.findUnique({where:{email:userEmail}});
      }catch(err){
        throw new Error(err);
      }
    }

    async ChangePassword(userId:number,newPassword:string){
      try {
        const encPassword = await new Promise<string>((resolve, reject) => {
          Bcrypt.hash(newPassword, this.saltRound, async function(err, hash) {
              if (err)
                  {
                      reject(new Error("error hashing"));
                  } else {
                      resolve(hash);
                  }
              });
      });
        const updatedData = await this.prisma.users.update(
          {
              where: { id : userId},
              data: {password: encPassword}
          });
          return updatedData
      } catch(err){
        throw new Error(err);
      }
    }
}

export default new userService();