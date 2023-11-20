import { nanoid } from "nanoid";
import db from "../connection";

export default{
    createTable(){
        const sql = `CREATE TABLE IF NOT EXISTS games (
            id VARCHAR(16) PRIMARY KEY,
            player1_id TEXT UNIQUE DEFAULT NULL,
            player2_id TEXT UNIQUE DEFAULT NULL,
            FOREIGN KEY (player1_id) REFERENCES users(id),
            FOREIGN KEY (player2_id) REFERENCES users(id)
        )`;
        db.run(sql,(err) => {
            if(err){
                console.log(`Error while creating games table! ${err.message}`)
                throw err;
            }
        })
    },
    createGameRoom(roomId){
        const sql = `INSERT INTO games (id) VALUES(?)`
        return new Promise((resolve, reject) => {
            db.run(sql,[roomId],(err) => {
                if(err) reject(err);
                else{
                    resolve(roomId)
                }
            })
        })
    },

    deleteGameRoom(roomId) {
        // Check if the room exists before attempting deletion
        const checkIdSql = `SELECT id FROM games WHERE id = ?`;
      
        return new Promise((resolve, reject) => {
          db.get(checkIdSql, [roomId], (err, row) => {
            if (err) {
              reject(err);
            } else if (!row) {
              // Room with the specified ID doesn't exist
              resolve(`Room with id: ${roomId} does not exist.`);
            } else {
              const deleteSql = `DELETE FROM games WHERE id = ?`;
              db.run(deleteSql, [roomId], (deleteErr) => {
                if (deleteErr) {
                  reject(deleteErr);
                } else {
                  resolve(`Room with id: ${roomId} has been deleted!`);
                }
              });
            }
          });
        });
      }
      ,

    joinGameRoom(userId, roomId){
        const checkIdSql = `SELECT * FROM games WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.get(checkIdSql, [roomId], (err, row) => {
                
              if (err) {
                reject(err);
              } else if (row.player1_id !== null && row.player2_id !== null) {
                resolve(`Room is full!`);
              } else if(row.player1_id === null && row.player1_id !== userId && row.player2_id !== userId){
                const joinSql = `UPDATE games SET player1_id = ? WHERE id = ?`;
                db.run(joinSql, [userId,roomId], (joinErr) => {
                  if (joinErr) {
                    reject(`You are already in a room!`);
                  } else {
                    resolve(`Successfully joined the room!`);
                  }
                });
              }
              else if(row.player2_id === null && row.player2_id !== userId && row.player1_id !== userId){
                const joinSql = `UPDATE games SET player2_id = ? WHERE id = ?`;
                db.run(joinSql, [userId, roomId], (joinErr) => {
                  if (joinErr) {
                    reject(joinErr);
                  } else {
                    resolve(`Successfully joined the room!`);
                  }
                });
              }
              else{
                reject("You are already joined to this room!")
              }
            });
          });
    },

    leaveGameRoom(roomId, userId){
      const findSql = `SELECT * FROM games WHERE id = ?`;
      return new Promise((resolve, reject) => {
        db.get(findSql, [roomId], (err,row) => {
          const sql1 = `UPDATE games SET player1_id = NULL WHERE id = ?`;
          const sql2 = `UPDATE games SET player2_id = NULL WHERE id = ?`;
          if(row.player1_id === userId){
            db.run(sql1, [roomId], (err) => {
              if(err)  reject(err)
              else{
                resolve('Successfully left the room!')
              }
            })
          }
          else if(row.player2_id === userId){
            db.run(sql2, [roomId], (err) => {
              if(err)  reject(err)
              else{
                resolve('Successfully left the room!')
              }
            })
          }
          else{
            resolve('You are not connected to this room!')
          }
        })
      })
    }
}