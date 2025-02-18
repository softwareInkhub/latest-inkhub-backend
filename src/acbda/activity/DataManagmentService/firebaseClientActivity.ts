/*


create get singleton firebase client

createFirebaseClient()
getFirebaseClient()


*/

import { v4 as uuidv4 } from 'uuid';
import { db } from '../../accessor/firebaseClientAccessor';

class FirebaseClientActivity {
    private static instance: FirebaseClientActivity;
    private constructor() {}

    public static getInstance(): FirebaseClientActivity {
        if (!FirebaseClientActivity.instance) {
            FirebaseClientActivity.instance = new FirebaseClientActivity();
        }
        return FirebaseClientActivity.instance;
    }

    async createDocument(collection: string, data: any, uuid: string): Promise<void> {
        try {
            await db.collection(collection).doc(uuid).set(data);
        } catch (error) {
            console.error(`Error creating document in ${collection}:`, error);
            throw error;
        }
    }

    async getDocument(collection: string, uuid: string): Promise<any | null> {
        try {
            const doc = await db.collection(collection).doc(uuid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error(`Error getting document from ${collection}:`, error);
            throw error;
        }
    }

    async updateDocument(collection: string, uuid: string, data: any): Promise<void> {
        try {
            await db.collection(collection).doc(uuid).update(data);
        } catch (error) {
            console.error(`Error updating document in ${collection}:`, error);
            throw error;
        }
    }

    async deleteDocument(collection: string, uuid: string): Promise<void> {
        try {
            await db.collection(collection).doc(uuid).delete();
        } catch (error) {
            console.error(`Error deleting document from ${collection}:`, error);
            throw error;
        }
    }

    async getAllDocuments(collectionName: string): Promise<any[]> {
        try {

            console.log('Inside getAllDocuments: ' + collectionName);
            const snapshot = await db.collection(collectionName).get();
            const documents: any[] = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            console.log('documents: ' + documents);

            return documents;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw new Error('Failed to retrieve documents');
        }
    }
}

export const firebaseClientActivity = FirebaseClientActivity.getInstance();