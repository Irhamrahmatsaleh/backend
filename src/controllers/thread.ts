import { Request, Response } from "express";
import threadService from "../services/thread";
import { dataContent_thread } from "../dto/thread";
import { redisClient } from "../libs/redis";

class threadController {
    async findUserThread(req : Request, res : Response)
    {
        try {
            const user = res.locals.verifyingUser;
            const userThreadData = await threadService.FindThread(user.id);
            if(!userThreadData) throw new Error("Thread not found");
            res.send(userThreadData);
        } catch (err) {
            res.status(404).json({ error: 'Thread not found' });;
        }
    }

    async findIDThread(req : Request, res : Response)
        /*  #swagger.parameters['threadid'] = {
            description: 'id for thread (int)'
        } */
    {
        try {
            const user = res.locals.verifyingUser;
            const threadData = await threadService.FindThreadID(parseInt(req.params.id), user.id);
            if(!threadData) throw new Error("Thread not found");
            res.send(threadData);
        } catch (err) {
            res.status(404).json({ error: 'Thread not found' });;
        }
    }

    async findOtherUserThread(req : Request, res : Response)
    /*  #swagger.parameters['otherid'] = {
        description: 'id for other user (int)'
    } */
{
    try {
        const user = res.locals.verifyingUser;
        const threadData = await threadService.FindOtherThread(parseInt(req.params.id), user.id);
        if(!threadData) throw new Error("Thread not found");
        res.send(threadData);
    } catch (err) {
        res.status(404).json({ error: 'Thread not found' });;
    }
}

    async findAllThread(req : Request, res : Response)
    {
        try {
            const user = res.locals.verifyingUser;
            const threadsData = await threadService.FindAllThread(user.id);
            if(!threadsData) throw new Error("Thread not found");
            await redisClient.set("ALL_THREADS_DATA", JSON.stringify(threadsData)); 
            res.send(threadsData);
        } catch (err) {
            res.status(404).json({ error: 'Thread not found' });;
        }
    }

    


    async findImage(req : Request, res : Response)
    {
        try {
            const userData = await threadService.FindAllImage();
            if(!userData) throw new Error("Image not found");
            res.send(userData);
        } catch (err) {
            res.status(404).json({ error: 'Image not found' });;
        }
    }

    async findRepliesID(req : Request, res : Response)
    {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await threadService.FindRepliesID(parseInt(req.params.id), userLocals.id);
            if(!userData) throw new Error("Thread not found");
            res.send(userData);
        } catch (err) {
            res.status(404).json({ error: 'Thread not found' });;
        }
    }

    async findSingleRepliesID(req : Request, res : Response)
    {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await threadService.FindSingleRepliesID(parseInt(req.params.id), userLocals.id);
            if(!userData) throw new Error("Thread not found");
            res.send(userData);
        } catch (err) {
            res.status(404).json({ error: 'Thread not found' });;
        }
    }

    async findChildrenRepliesID(req : Request, res : Response)
{
    try {
        const userLocals = res.locals.verifyingUser;
        const userData = await threadService.FindChildrenRepliesID(parseInt(req.params.id), userLocals.id);
        if(!userData) throw new Error("Thread not found");
        res.send(userData);
    } catch (err) {
        res.status(404).json({ error: 'Thread not found' });;
    }
}

    async postReplies(req : Request, res: Response){
        /*  #swagger.parameters['repliesid'] = {
            description: 'id for repliedThread (int)'
        } */
         /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/threadSchema"
                        }  
                    }
                }
            } 
        */
       /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'Some description...',
        } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
              }
              
            const user = res.locals.verifyingUser;
            
            const dataCreated : dataContent_thread = await threadService.PostReplies(body, user, parseInt(req.params.id))
              
            res.status(201).json({
                stats: "replies created",
                value: dataCreated
            });
            } catch (err)
            { 
                res.status(400).json({
                    message: 'replies has not been saved',
                    err: err
                }
                );
            }
    }

    async postRepliesChildren(req : Request, res: Response){
        /*  #swagger.parameters['repliesid'] = {
            description: 'id for repliedParent (int)'
        } */
         /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/threadSchema"
                        }  
                    }
                }
            } 
        */
       /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'Some description...',
        } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
              }
              
            const user = res.locals.verifyingUser;
            
            const dataCreated : dataContent_thread = await threadService.PostRepliesChildren(body, user, parseInt(req.params.id))
              
            res.status(201).json({
                stats: "replies created",
                value: dataCreated
            });
            } catch (err)
            { 
                res.status(400).json({
                    message: 'replies has not been saved',
                    err: err.message
                }
                );
            }
    }


    async postThread(req : Request, res: Response){
         /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/threadSchema"
                        }  
                    }
                }
            } 
        */
       /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'Some description...',
        } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
              }
              
            const user = res.locals.verifyingUser;
            
            const dataCreated : dataContent_thread = await threadService.PostThread(body, user)
              
            redisClient.del("ALL_THREADS_DATA")
            res.status(201).json({
                stats: "data created",
                value: dataCreated
            });
            } catch (err)
            { 
                res.status(400).json({
                    message: 'data has not been saved',
                    err: err
                }
                );
            }
    }

    async updateThread(req : Request, res: Response){
        /*  #swagger.parameters['threadid'] = {
            description: 'id for thread (int)'
        } */
         /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/threadSchema"
                        }  
                    }
                }
            } 
        */
        try {           
            const dataUpdated  : dataContent_thread = await threadService.UpdateThread(parseInt(req.params.id),req.body)
            redisClient.del("ALL_THREADS_DATA")
            res.status(201).json({
                stats: "data updated",
                value: dataUpdated
            });
        } catch (err)
        {  
            res.status(400).json({ error: 'Create User error'});
        }
    }

    async deleteThread(req : Request, res : Response){
        /*  #swagger.parameters['threadid'] = {
            description: 'id for thread (int)'
        } */
        try {
            const userData : dataContent_thread = await threadService.DeleteThread(parseInt(req.params.id));
            redisClient.del("ALL_THREADS_DATA")
            res.status(201).json({
                stats: "data deleted",
                content: userData.content
            }).send;
        } catch (err) {
            res.sendStatus(400);
        }
    }

    async deleteReply(req : Request, res : Response){
        /*  #swagger.parameters['replyid'] = {
            description: 'id for reply (int)'
        } */
        try {
            const userData = await threadService.DeleteReply(parseInt(req.params.id));
            redisClient.del("ALL_THREADS_DATA")
            res.status(201).json({
                stats: "data deleted",
                content: userData.content
            }).send;
        } catch (err) {
            res.sendStatus(400);
        }
    }

    async setLikedID(req : Request, res : Response)
        /*  #swagger.parameters['likeid'] = {
            description: 'id for replies (int)'
        } */
    {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await threadService.setLiked(parseInt(req.params.id), user.id);
            if(!likedData) throw new Error("Like Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "thread liked"
            });
        } catch (err) {
            res.status(404).json({ error: 'Like Error', err: err });;
        }
    }

    async setUnlikedID(req : Request, res : Response)
    /*  #swagger.parameters['unlikeid'] = {
        description: 'id for replies (int)'
    } */
{
    try {
        const user = res.locals.verifyingUser;
        const likedData = await threadService.setUnliked(parseInt(req.params.id), user.id);
        if(!likedData) throw new Error("unlike Error");
        res.json({
            thread_id: parseInt(req.params.id),
            stats: "thread unliked"
        });
    } catch (err) {
        res.status(404).json({ error: 'unlike Error', err: err });;
    }
}

async setLikedReplies(req : Request, res : Response)
        /*  #swagger.parameters['likerepliesid'] = {
            description: 'id for likedreplies (int)'
        } */
    {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await threadService.setLikedReplies(parseInt(req.params.id), user.id);
            if(!likedData) throw new Error("Like Replies Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "replies liked"
            });
        } catch (err) {
            res.status(404).json({ error: 'Like Replies Error', err: err });;
        }
    }

    async setUnlikedReplies(req : Request, res : Response)
    /*  #swagger.parameters['unlikerepliesid'] = {
        description: 'id for unlikedreplies (int)'
    } */
{
    try {
        const user = res.locals.verifyingUser;
        const likedData = await threadService.setUnlikedReplies(parseInt(req.params.id), user.id);
        if(!likedData) throw new Error("unlike replies Error");
        res.json({
            thread_id: parseInt(req.params.id),
            stats: "thread unliked"
        });
    } catch (err) {
        res.status(404).json({ error: 'unlike replies Error', err: err });;
    }
}

}

export default new threadController()