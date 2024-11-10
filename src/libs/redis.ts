import { RedisClientType, createClient } from 'redis';

export const redisClient : RedisClientType<any,any,any> = createClient({
  url: `${process.env.REDIS_URL}`,
})
.on('error', err => console.log('Redis Client Error', err));
