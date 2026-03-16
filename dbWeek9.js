import Dexie from 'dexie';

export const db = new Dexie('InventoryDatabase');

db.version(1).stores({
    items: '++id, name, quantity'
});