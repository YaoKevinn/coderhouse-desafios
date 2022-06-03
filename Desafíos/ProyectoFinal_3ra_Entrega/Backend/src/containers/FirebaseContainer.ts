import { firebaseConfig } from './../db/config';
import admin from 'firebase-admin';

admin.initializeApp(firebaseConfig);

const db = admin.firestore();
// let batch = db.batch();  /* only for insert many */

export class FirebaseContainer {
    collectionString: string;

    constructor(collectionString: string) {
        this.collectionString = collectionString;
    }

    async getAll() {
        const query = db.collection(this.collectionString);
        try {
            const snapShot = await query.get();
            let docs = snapShot.docs;
            return docs;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id: string) {
        const query = db.collection(this.collectionString);
        try {
            const doc = query.doc(id);
            const item = await doc.get();
            return { ...item.data(), id };
        } catch (error) {
            console.log(error);
        }
    }

    async addItem(item: any) {
        try {
            const query = db.collection(this.collectionString);
            const id = query.doc().id;
            await query.doc(id).set(item);
            return { ...item, id };
        } catch (error) {
            console.log(error);
        }
    }

    async updateItemById(id: string, item: any) {
        const query = db.collection(this.collectionString);
        try {
            const doc = query.doc(id);
            await doc.set(item);
            return { ...item, id }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteItemById(id: string) {
        const query = db.collection(this.collectionString);
        try {
            const doc = query.doc(id);
            await doc.delete()
        } catch (error) {
            console.log(error);
        }
    }
    
}