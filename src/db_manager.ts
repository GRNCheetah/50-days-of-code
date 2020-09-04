import Database, { Database as DatabaseType, Statement } from "better-sqlite3";
import { logBot } from "./logging_config";

const DB_PATH: string = "./db/song_queue.db";

interface songObj {
  // eslint-disable-next-line camelcase
  q_num: number;
  title: string;
}

// Create the tables if they aren't already in there
function createTables() {
  const db: DatabaseType = new Database(DB_PATH);
  const createLeaderboard: Statement = db.prepare(`CREATE TABLE IF NOT EXISTS leaderboard (
        username TEXT,
        nickname TEXT,
        attempted INT,
        correct INT,
        PRIMARY KEY(username)
    )`);
  
  const questionNum: Statement = db.prepare(`CREATE TABLE IF NOT EXISTS questionNum (
    num INT
  )`);

  createLeaderboard.run();
  questionNum.run();
  db.close();
}

// List all songs in the queue for this server
function getLeaderboard(serverName: string): songObj[] {
  const db = new Database(DB_PATH);
  const selectSongs: Statement = db.prepare(
    `SELECT username, correct, attempted FROM leaderboard ORDER BY correct`
  );
  const data = selectSongs.all([serverName]);
  db.close();
  return data;
}



export {
  createTables,
  getLeaderboard
};
