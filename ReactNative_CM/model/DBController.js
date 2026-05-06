import * as SQLite from 'expo-sqlite';

export default class DBController {
    constructor() {
        this.db = null;
    }

    async openDB() {
        this.db = await SQLite.openDatabaseAsync('MangiaDB');
        const query = "CREATE TABLE IF NOT EXISTS Image (MID INTEGER PRIMARY KEY, imageVersion INTEGER, base64 TEXT);";
        await this.db.execAsync(query);
    }
    
    async saveImage(mid, imageVersion, base64) {
        const query = "INSERT OR REPLACE INTO Image (MID, imageVersion, base64) VALUES (?, ?, ?)";
        const params = [mid, imageVersion, base64];
        await this.db.runAsync(query, params);
    }


    async getImageFromDB(mid) {
        const query = "SELECT * FROM Image WHERE MID = ?";
        const params = [mid];
        const result = await this.db.getFirstAsync(query, params);
        return result;
    }
/*
    async openDB() {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync('MangiaDB');
            this.db.transaction(tx => {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS Image (MID INTEGER PRIMARY KEY, imageVersion INTEGER, base64 TEXT);"
                );
            });
        }
    }

    async saveImage(mid, imageVersion, base64) {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    "INSERT OR REPLACE INTO Image (MID, imageVersion, base64) VALUES (?, ?, ?)",
                    [mid, imageVersion, base64],
                    (_, result) => resolve(result),
                    (_, error) => reject(error)
                );
            });
        });
    }
    async getImageFromDB(mid) {
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM Image WHERE MID = ?",
                    [mid],
                    (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
                    (_, error) => reject(error)
                );
            });
        });
    }
    */
}