"use strict";
/*


create get singleton firebase client

createFirebaseClient()
getFirebaseClient()


*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseClientActivity = void 0;
const firebaseClientAccessor_1 = require("../../accessor/firebaseClientAccessor");
class FirebaseClientActivity {
    constructor() { }
    static getInstance() {
        if (!FirebaseClientActivity.instance) {
            FirebaseClientActivity.instance = new FirebaseClientActivity();
        }
        return FirebaseClientActivity.instance;
    }
    createDocument(collection, data, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebaseClientAccessor_1.db.collection(collection).doc(uuid).set(data);
            }
            catch (error) {
                console.error(`Error creating document in ${collection}:`, error);
                throw error;
            }
        });
    }
    getDocument(collection, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield firebaseClientAccessor_1.db.collection(collection).doc(uuid).get();
                return doc.exists ? doc.data() : null;
            }
            catch (error) {
                console.error(`Error getting document from ${collection}:`, error);
                throw error;
            }
        });
    }
    updateDocument(collection, uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebaseClientAccessor_1.db.collection(collection).doc(uuid).update(data);
            }
            catch (error) {
                console.error(`Error updating document in ${collection}:`, error);
                throw error;
            }
        });
    }
    deleteDocument(collection, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebaseClientAccessor_1.db.collection(collection).doc(uuid).delete();
            }
            catch (error) {
                console.error(`Error deleting document from ${collection}:`, error);
                throw error;
            }
        });
    }
    getAllDocuments(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Inside getAllDocuments: ' + collectionName);
                const snapshot = yield firebaseClientAccessor_1.db.collection(collectionName).get();
                const documents = [];
                snapshot.forEach(doc => {
                    documents.push(Object.assign({ id: doc.id }, doc.data()));
                });
                console.log('documents: ' + documents);
                return documents;
            }
            catch (error) {
                console.error('Error fetching documents:', error);
                throw new Error('Failed to retrieve documents');
            }
        });
    }
}
exports.firebaseClientActivity = FirebaseClientActivity.getInstance();
