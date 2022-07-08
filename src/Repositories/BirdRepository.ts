import RedisConnection from "../DB/RedisConnection";
import FireStoreConnection from "../DB/FireStoreConnection";

class BirdRepository {
    private static readonly REDIS_PREFIX = 'bird_';

    public static async getData(collection: string, doc: string) : Promise<any> {
        const redisConnection = await RedisConnection.getInstance();

        const redisResponse = await redisConnection.getData(BirdRepository.REDIS_PREFIX + doc);

        if (!redisResponse) {
            const connection = FireStoreConnection.getInstance();
            const dbData = await connection.getData(collection, doc);

            if (dbData) {
                await redisConnection.setData(BirdRepository.REDIS_PREFIX + doc, dbData);
                return dbData.data;
            }

            return null;
        }

        return redisResponse.data;
    }
}

export default BirdRepository;