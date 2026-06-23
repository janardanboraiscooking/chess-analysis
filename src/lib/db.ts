import { openDB, IDBPDatabase } from 'idb';
import { AnalyzedGame } from '@/types';

const DB_NAME = 'chess-analysis';
const DB_VERSION = 1;
const STORE_NAME = 'games';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('analyzedAt', 'analyzedAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveGame(game: AnalyzedGame): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, game);
}

export async function getGame(id: string): Promise<AnalyzedGame | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function getAllGames(): Promise<AnalyzedGame[]> {
  const db = await getDB();
  const games = await db.getAll(STORE_NAME);
  return games.sort((a, b) => b.analyzedAt - a.analyzedAt);
}

export async function deleteGame(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
