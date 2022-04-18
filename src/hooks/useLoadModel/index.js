import { useCallback } from 'react';

export default function useIndexedDb() {
  return useCallback((download) => new Promise((resolve) => {
    const dbconnect = indexedDB.open('internalModels', 1);

    dbconnect.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      const store = db.createObjectStore('model', { keyPath: 'Type' });
      store.createIndex('Type', 'Type', { unique: true });
      store.createIndex('Buffer', 'Buffer', { unique: true });
    };

    dbconnect.onsuccess = (dbEv) => {
      const db = dbEv.target.result;
      const transaction = db.transaction('model', 'readwrite');
      const dbStore = transaction.objectStore('model');

      if (download) {
        dbStore.add({
          Type: 'partDetector',
          Buffer: download.data,
        });
      }

      transaction.onerror = (errorEv) => {
        throw new Error(`An error occurred : ${errorEv.target.error.message}`);
      };

      transaction.oncomplete = () => {
        const transactionStore = db.transaction('model', 'readonly').objectStore('model');
        const query = transactionStore.openCursor();

        query.onerror = (errorEv) => {
          throw new Error(`Request failed: ${errorEv.target.error.message}`);
        };

        const payload = {};
        query.onsuccess = (queryEv) => {
          const cursor = queryEv.target.result;
          if (cursor) {
            payload[cursor.value.Type] = cursor.value.Buffer;
            // dispatch(modelsSlice.actions.update(payload));
            cursor.continue();
          } else {
            resolve(payload);
          }
        };
      };
    };
  }), []);
}
