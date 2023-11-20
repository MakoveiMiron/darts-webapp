import db from "./connection"
import usersModel from "./models/users-model"
import gamesModel from "./models/game-model"

export default function initDb() {
    db.get('PRAGMA foreign_keys = ON');
    usersModel.createTable();
    gamesModel.createTable();
}