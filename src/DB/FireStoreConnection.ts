import * as firestore from 'firebase-admin';
import process from "process";

class FireStoreConnection {
    private static instance;
    private readonly db;

    private constructor() {
        try {
            firestore.app();
        } catch (err) {
            firestore.initializeApp({
                credential: firestore.credential.cert(process.cwd() + '/dist/telegram-bird-ringing-firebase-adminsdk-ex7by-36560a78c2.json')
            });
        }

        this.db = firestore.firestore();
    }

    public static getInstance(): FireStoreConnection {
        if (!FireStoreConnection.instance) {
            return new FireStoreConnection();
        }

        return FireStoreConnection.instance;
    }

    public getDb() {
        return this.db;
    }

    public getData(collection: string, doc: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).doc(doc).get().then(doc => {
                if (!doc.exists) {
                    resolve(null);
                }

                resolve(doc.data());
                return;
            });
        });
    }
}

export default FireStoreConnection;