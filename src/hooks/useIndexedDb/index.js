import { useCallback } from 'react';

export default function useIndexedDb() {
  return useCallback((download) => new Promise((resolve) => {
    const dbconnect = indexedDB.open('internalModels', 1);

    dbconnect.onupgradeneeded = (ev) => {
      console.log('Upgrade DB');
      const db = ev.target.result;
      const store = db.createObjectStore('model', { keyPath: 'Type' });
      store.createIndex('Type', 'Type', { unique: true });
      store.createIndex('Buffer', 'Buffer', { unique: true });
    };

    dbconnect.onsuccess = (dbEv) => {
      console.log('Success upgrading DB');
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
        console.error('An error occurred !', errorEv.target.error.message);
      };

      transaction.oncomplete = () => {
        console.log('Les données ont été ajoutées avec succès !');
        const transactionStore = db.transaction('model', 'readonly').objectStore('model');
        const query = transactionStore.openCursor();

        query.onerror = (errorEv) => {
          console.error('Echec de la requête !', errorEv.target.error.message);
        };

        const payload = {};
        query.onsuccess = (queryEv) => {
          const cursor = queryEv.target.result;
          if (cursor) {
            console.log(cursor.key, cursor.value.Type, cursor.value.Buffer);
            payload[cursor.value.Type] = cursor.value.Buffer;
            // dispatch(modelsSlice.actions.update(payload));
            cursor.continue();
          } else {
            console.log('Plus d’entrées disponibles');
            resolve(payload);
          }
        };
      };
    };
  }), []);
}
