import { NextFunction, Request, Response } from "express";
import { redisClient } from "../libs/redis";

export async function delRedisThreads(req: Request, res: Response, next: NextFunction)
{
    await redisClient.del("THREADS_DATA");
    console.log("Redis Reset!")
    next();
}