import { db } from '../navigation/FireBaseConn';
import { ref as databaseRef, onValue } from 'firebase/database';

async function getListPoster() {
  return new Promise((resolve, reject) => {
    try {
      const starCountRef = databaseRef(db, 'Eventi/');

      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        let maxID = null;

        // Trova l'ID maggiore nella lista di oggetti
        Object.values(data).forEach((item) => {
          if (!maxID || item.ID > maxID) {
            maxID = item.ID;
          }
        });

        if (maxID !== null) {
          resolve(maxID);
        } else {
          reject(new Error('Nessun ID maggiore trovato.'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export { getListPoster };
