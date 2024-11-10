import { PrismaClient } from '@prisma/client';
import { dataContent_thread, thread, threadValidate } from '../dto/thread';
import {v2 as cloudinary} from 'cloudinary';
import {users} from '../dto/user'

class threadServices {
    private prisma : PrismaClient;

      constructor()
      {
        this.prisma = new PrismaClient();
        cloudinary.config({ 
          cloud_name: process.env.CLOUDINARY_NAME, 
          api_key: process.env.CLOUDINARY_API_KEY, 
          api_secret: process.env.CLOUDINARY_SECRET 
        });
      }

    async FindThread(idUser : number){
      try{  
        const fetchedData = await this.prisma.threads.findMany({
          orderBy: [{
            update_at : 'desc'
          }],
          where: {created_by: idUser},
          include : {
            users: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true
              }
            },
            likes:{
              select: {
                user_id : true
              }
            },
            replies:{
              select: {
                user_id : true
              }
            },
          },
        })
        if (fetchedData){
            const threadData = fetchedData.map(data => {
            const likesID = new Set(data.likes.map(l => l.user_id))
            const replyID = new Set(data.replies.map(r => r.user_id))
            const isliked = likesID.has(idUser);
            const isReplied = replyID.has(idUser);
            data.number_of_replies = data.replies.length;

            return {...data, isliked, isReplied}
          })
          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }

    async FindThreadID(idThread : number, idUser : number){
      try{  
        const fetchedData = await this.prisma.threads.findUnique({
          where: {id: idThread},
          include : {
            users: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true
              }
            },
            likes:{
              select: {
                user_id : true
              }
            },
            replies:{
              select: {
                user_id : true
              }
            },
          },
        })
        if (fetchedData){
          const likesID = new Set(fetchedData.likes.map(l => l.user_id))
          const replyID = new Set(fetchedData.replies.map(r => r.user_id))
          const isliked = likesID.has(idUser);
          const isReplied = replyID.has(idUser);
          fetchedData.number_of_replies = fetchedData.replies.length;

          const threadData =  {
            ...fetchedData, isliked, isReplied
          }
          
          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }

    async FindOtherThread(idOther : number, idCurrentUser : number){
      try{  
        const fetchedData = await this.prisma.threads.findMany({
          orderBy: [{
            update_at : 'desc'
          }],
          where: {created_by: idOther},
          include : {
            users: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true
              }
            },
            likes:{
              select: {
                user_id : true
              }
            },
            replies:{
              select: {
                user_id : true
              }
            },
          },
        })
        if (fetchedData){
          const threadData = fetchedData.map(data => {
          const likesID = new Set(data.likes.map(l => l.user_id))
          const replyID = new Set(data.replies.map(r => r.user_id))
          const isliked = likesID.has(idCurrentUser);
          const isReplied = replyID.has(idCurrentUser);
          data.number_of_replies = data.replies.length;

          return {...data, isliked, isReplied}
        })
          
          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }

    async FindAllThread(idCurrentUser : number){
      try{
        const fetchedData = await this.prisma.threads.findMany({
          orderBy: [{
            update_at : 'desc'
          }],
          include : {
            users: {
              select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true
              }
            },
            likes:{
              select: {
                user_id : true
              }
            },
            replies:{
              select: {
                user_id : true
              }
            },
          },
        })

        if (fetchedData){
          const threadData = fetchedData.map(data => {
            const likesID = new Set(data.likes.map(l => l.user_id))
            const replyID = new Set(data.replies.map(r => r.user_id))
            const isliked = likesID.has(idCurrentUser);
            const isReplied = replyID.has(idCurrentUser);
            data.number_of_replies = data.replies.length;

            let isUser = false;
            if(data.created_by === idCurrentUser) isUser = true;
            return {...data, isliked, isReplied, isUser}
          })
          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }

      } catch (error){
        throw new Error(error);
      }
    }

    
    async FindAllImage(){
      try{
        const fetchedData = await this.prisma.threads.findMany({
          orderBy: [{
            update_at : 'desc'
          }],
          include : {
            users: {
              select: {
                username: true,
                full_name: true,
                photo_profile: true
              }
            },
            likes:true
          },
        })

        if (fetchedData){
          return fetchedData;
        } else {
          throw new Error("All Image Empty");
        }

      } catch (error){
        throw new Error(error);
      }
    }

    async FindRepliesID(idThread : number, idCurrentUser : number){
      try{  
        const fetchedData = await this.prisma.replies.findMany({
          orderBy: [{
            updated_at : 'desc'
          }],
          where: {thread_id: idThread},
          include : {
            users : {
              select : {
                id: true,
                photo_profile : true,
                username : true,
                full_name : true
              }
            },
            likesreplies : true,
            childReplies : true
          }
        })
        if (fetchedData){
          const threadData = fetchedData.map(data => {
            const likesID = new Set(data.likesreplies.map(l => l.user_id))
            const replyID = new Set(data.childReplies.map(r => r.user_id))
            const isLiked = likesID.has(idCurrentUser);
            const isReplied = replyID.has(idCurrentUser);
            let isUser = false;
            if(data.created_by === idCurrentUser) isUser = true;
            const likesCount = data.likesreplies.length;
            const repliesCount = data.childReplies.length;
            return {...data, isUser,likesCount,repliesCount,isLiked,isReplied}
          })

          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }

    async FindSingleRepliesID(idReply : number, idCurrentUser : number){
      try{  
        const fetchedData = await this.prisma.replies.findUnique({
          where: {id: idReply},
          include : {
            users : {
              select : {
                id: true,
                photo_profile : true,
                username : true,
                full_name : true
              }
            },
            likesreplies : true,
            childReplies : true
          }
        })
        if (fetchedData){
            const likesID = new Set(fetchedData.likesreplies.map(l => l.user_id))
            const replyID = new Set(fetchedData.childReplies.map(r => r.user_id))
            const isLiked = likesID.has(idCurrentUser);
            const isReplied = replyID.has(idCurrentUser);
            let isUser = false;
            if(fetchedData.created_by === idCurrentUser) isUser = true;
            const likesCount = fetchedData.likesreplies.length;
            const repliesCount = fetchedData.childReplies.length;
            return {...fetchedData, isUser,likesCount,repliesCount,isLiked,isReplied};
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }

    async FindChildrenRepliesID(idParent : number, idCurrentUser : number){
      try{  
        const fetchedData = await this.prisma.replies.findMany({
          orderBy: [{
            updated_at : 'desc'
          }],
          where: {parent_id: idParent},
          include : {
            users : {
              select : {
                id: true,
                photo_profile : true,
                username : true,
                full_name : true
              }
            },
            likesreplies : true,
            childReplies : true
          }
        })
        if (fetchedData){
          const threadData = fetchedData.map(data => {
            const likesID = new Set(data.likesreplies.map(l => l.user_id))
            const replyID = new Set(data.childReplies.map(r => r.user_id))
            const isLiked = likesID.has(idCurrentUser);
            const isReplied = replyID.has(idCurrentUser);
            let isUser = false;
            if(data.created_by === idCurrentUser) isUser = true;
            const likesCount = data.likesreplies.length;
            const repliesCount = data.childReplies.length;
            return {...data, isUser,likesCount,repliesCount,isLiked,isReplied}
          })

          return threadData;
        } else {
          throw new Error("All Thread Empty");
        }
      } catch (error){
        throw new Error(error);
      }
    }


    async PostReplies(dto : dataContent_thread, user : users, idThread : number)
    {
      
        try {
            const validate = threadValidate.validate(dto);
        
            if (validate.error) {
              throw new Error('validate error');
            }

           // Upload image if provided
          let imageUrl = null;
          if (dto.image) {
            const upload = await cloudinary.uploader.upload(dto.image, {
                upload_preset: "threads"
            });
            imageUrl = upload.secure_url;
        }
            
            const createdData = await this.prisma.replies.create({ 
                data: {
                    user_id: user.id,
                    thread_id: idThread,
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id,
                }
            });

            if(!createdData) throw new Error("error create data");
            return createdData;
        } catch (err)
        {
          console.error(err);
            throw new Error(err);
        }
    }

    async PostRepliesChildren(dto : dataContent_thread, user : users, idParent : number)
    {
      
        try {
            const validate = threadValidate.validate(dto);
        
            if (validate.error) {
              throw new Error('validate error');
            }

           // Upload image if provided
          let imageUrl = null;
          if (dto.image) {
            const upload = await cloudinary.uploader.upload(dto.image, {
                upload_preset: "threads"
            });
            imageUrl = upload.secure_url;
        }
            
            const createdData = await this.prisma.replies.create({ 
                data: {
                    user_id: user.id,
                    parent_id: idParent,
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id,
                }
            });

            if(!createdData) throw new Error("error create data");
            return createdData;
        } catch (err)
        {
          console.error(err);
            throw new Error(err);
        }
    }

    async PostThread(dto : dataContent_thread, user : users)
    {
      
        try {
            const validate = threadValidate.validate(dto);
        
            if (validate.error) {
              throw new Error('validate post thread error');
            }

           // Upload image if provided
          let imageUrl = null;
          if (dto.image) {
            const upload = await cloudinary.uploader.upload(dto.image, {
                upload_preset: "threads"
            });
            imageUrl = upload.secure_url;
          }
            
            const createdData = await this.prisma.threads.create({ 
                data: {
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id
                }
            });

            if(!createdData) throw new Error("error create threads");
            return createdData;
        } catch (err)
        {
          console.error(err);
            throw new Error(err);
        }
    }

    async UpdateThread(idUser : number, dto : dataContent_thread){
        const data : dataContent_thread = {
            content : dto.content,
            image : dto.image
          }

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if(!data[key]) delete data[key];
            }
        }
    try {
        const validate = threadValidate.validate(dto);
        
        if (validate.error) {
          throw new Error(JSON.stringify(validate.error));
        }

        const dataUpdate = await this.prisma.threads.update(
            {
                where: { id : idUser},
                data: {...data}
            });
        if(!dataUpdate) throw new Error("error update data");
        return dataUpdate;
    } catch (err) {
        throw new Error(err);
    }
    }

    async DeleteThread(idThread : number)
    {
        try {
            const deletedData = await this.prisma.threads.delete({
                where: {
                    id : idThread
                }
            })
            
            return deletedData;
        } catch (err)
        {
            throw new Error(err);
        }
    }

    async DeleteReply(idReply : number)
    {
        try {
            const deletedData = await this.prisma.replies.delete({
                where: {
                    id : idReply
                }
            })
            
            return deletedData;
        } catch (err)
        {
            throw new Error(err);
        }
    }

    async setLiked(idThread : number, idUser : number){
      try {
        const likedData = await this.prisma.likes.create({
          data : {
            user_id: idUser,
            thread_id: idThread,
            created_by: idUser,
            updated_by: idUser
          }
        })
        return likedData;
      } catch(err){
        throw new Error(err);
      }
    }

    async setUnliked(idThread : number, idUser : number){
      try {
        const unlikedData = await this.prisma.likes.deleteMany({ where: {
          user_id : idUser,
          thread_id: idThread
        }})
        return unlikedData;
      } catch(err){
        throw new Error(err);
      }
    }

    async setLikedReplies(idReply : number, idUser : number){

      try {
        const likedData = await this.prisma.likesreplies.create({
          data : {
            user_id: idUser,
            reply_id: idReply,
            created_by: idUser,
            updated_by: idUser
          }
        })
        return likedData;
      } catch(err){
        throw new Error(err);
      }
    }

    async setUnlikedReplies(idReply : number, idUser : number){
      try {
        const unlikedData = await this.prisma.likesreplies.deleteMany({ where: {
          user_id : idUser,
          reply_id: idReply
        }})
        return unlikedData;
      } catch(err){
        throw new Error(err);
      }
    }
}

export default new threadServices()