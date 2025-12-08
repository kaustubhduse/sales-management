import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

(async () => {
  try{
    await redis.ping();
    console.log('Connected to Upstash Redis');
  }
  catch(error){
    console.error('Redis connection error:', error.message);
  }
})();


export const getCached = async (key) => {
  try{
    const cached = await redis.get(key);
    return cached || null;
  }
  catch(error){
    console.error('Cache read error:', error.message);
    return null;
  }
};


export const setCache = async (key, data, ttl = 300) => {
  try{
    await redis.set(key, data, { ex: ttl });
  }
  catch(error){
    console.error('Cache write error:', error.message);
  }
};


export const deleteCache = async (key) => {
  try{
    await redis.del(key);
  }
  catch(error){
    console.error('Cache delete error:', error.message);
  }
};


export const deleteCachePattern = async (pattern) => {
  try{
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
  catch(error){
    console.error('Cache pattern delete error:', error.message);
  }
};

export default redis;
