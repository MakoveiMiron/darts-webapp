import {db} from "./connection";
import { createUsersTable, setIoUsers } from "./models/users-model";
import { createGamesTable, setIoGames } from "./models/game-model";


export default function initDb(io) {
    db.run('PRAGMA foreign_keys = ON');
    createUsersTable();
    createGamesTable();
    setIoUsers(io);
    setIoGames(io);
}
