import RedisConnection from "../DB/RedisConnection";
import FireStoreConnection from "../DB/FireStoreConnection";

class TermRepository {
    private static readonly REDIS_PREFIX = 'term_';

    public static async getData(collection: string, doc: string) : Promise<any> {
        const redisConnection = await RedisConnection.getInstance();

        const redisResponse = await redisConnection.getData(TermRepository.REDIS_PREFIX + doc);

        if (!redisResponse) {
            const connection = FireStoreConnection.getInstance();
            const dbData = await connection.getData(collection, doc);

            if (dbData) {
                await redisConnection.setData(TermRepository.REDIS_PREFIX + doc, dbData);
                return dbData;
            }

            return null;
        }

        return redisResponse;
    }
}

export default TermRepository;