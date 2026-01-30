import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'mbaNDwwws0PUuVOXsiSiz0PM1AEHTXgT',
    socket: {
        host: 'redis-15634.c84.us-east-1-2.ec2.cloud.redislabs.com',
        port: 15634
    }
});

client.on('error', err => console.log('Redis Client Error', err));

async function initializeRedis() {
    await client.connect();

    // await client.set('foo', 'bar');
    // const result = await client.get('foo');
    console.log("redis running")  // >>> bar
    // return result;

    // await client
}

initializeRedis();



    // const redis = new Redis({
    //     host: "",
    //     port: 6379,
    //     password: "password",
    // });

