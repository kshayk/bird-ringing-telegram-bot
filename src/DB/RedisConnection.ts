import { createClient } from 'redis';

class RedisConnection {
    private static instance;
    private client;

    private constructor() {
    }

    private async connect() {
        return new Promise(async (resolve, reject) => {
            const client = createClient();

            client.connect().then(() => {
                client.on('error', (err) => {
                    throw new Error(err)
                });

                this.client = client;

                resolve(client);
            });
        })
    }

    public static async getInstance(): Promise<RedisConnection> {
        if (!RedisConnection.instance) {
            const instance = new RedisConnection();
            await instance.connect();

            return instance;
        }

        return RedisConnection.instance;
    }

    public async getData(key: string): Promise<any> {
        let data = await this.client.get(key);

        if (data && data.startsWith('{')) {
            data = JSON.parse(data);
        }

        return data;
    }

    /**
     * @param key: string
     * @param value: any
     * @param ttl: number - time to live in seconds. Default is 86400 (1 day)
     */
    public async setData(key: string, value: any, ttl: number = 86400): Promise<any> {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        await this.client.set(key, value);
    }
}

export default RedisConnection;