import { nanoid } from "nanoid";
import {db} from "../connection";

  let io;
  function setIoGames(socketIo) {
      io = socketIo;
  }

   function createGamesTable(){
        const sql = `CREATE TABLE IF NOT EXISTS games (
            id VARCHAR(16) PRIMARY KEY,
            player1_id TEXT UNIQUE DEFAULT NULL,
            player2_id TEXT UNIQUE DEFAULT NULL,
            player1_points INTEGER DEFAULT 0,
            player2_points INTEGER DEFAULT 0,
            player_throwing TEXT,
            sets_count INTEGER DEFAULT 0,
            legs_count INTEGER DEFAULT 0,
            current_leg INTEGER DEFAULT 0,
            current_set INTEGER DEFAULT 0,
            timer INTEGER DEFAULT 10,
            game_mode INTEGER DEFAULT 0,
            socketId1 TEXT,
            socketId2 TEXT,
            host TEXT,
            FOREIGN KEY (player1_id) REFERENCES users(id),
            FOREIGN KEY (player2_id) REFERENCES users(id),
            FOREIGN KEY (host) REFERENCES users(id)
        )`;
        db.run(sql,(err) => {
            if(err){
                console.log(`Error while creating games table! ${err.message}`)
                throw err;
            }
        })
    }
    function createGameRoom(roomId, gameMode, setCount, legCount, userId){
        const sql = `INSERT INTO games (id, player1_points, player2_points, sets_count, legs_count,  game_mode, host) VALUES(?, ?, ?, ?, ?, ?, ?)`
        return new Promise((resolve, reject) => {
            db.run(sql,[roomId, gameMode, gameMode, setCount, legCount, gameMode, userId],(err) => {
                if(err) reject(err);
                else{
                    resolve({roomId, gameMode, setCount})
                }
            })
        })
    }

   function deleteGameRoom(roomId) {
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
      

      function joinGameRoom(userId, roomId, socketId) {
        const checkIdSql = `SELECT * FROM games WHERE id = ?`;
        return new Promise((resolve, reject) => {
          db.get(checkIdSql, [roomId], async (err, row) => {
            const currentRoomId = await getCurrentRoom(userId);
            if(currentRoomId !== undefined && currentRoomId !== roomId){
              await leaveGameRoom(currentRoomId, userId, socketId);
            }
      
            if (err) {
              reject(err);
            } else if (row.player1_id !== null && row.player2_id !== null) {
              resolve(`Room is full!`);
            } else if (row.player1_id === null && row.player1_id !== userId && row.player2_id !== userId) {
              
              const joinSql = `UPDATE games SET player1_id = ?, socketId1 = ? WHERE id = ?`;
              db.run(joinSql, [userId, socketId, roomId], function (joinErr) {
                if (joinErr) {
                  resolve(`You are already in a room!`);
                } else {
                  // Fetch the updated row after the update operation
                  const updatedRowSql = `SELECT * FROM games WHERE id = ?`;
                  db.get(updatedRowSql, [roomId], (updatedRowErr, updatedRow) => {
                    if (updatedRowErr) {
                      reject(updatedRowErr);
                    } else {
                      resolve(updatedRow);
                    }
                  });
                }
              });
            } else if (row.player2_id === null && row.player2_id !== userId && row.player1_id !== userId) {
              const currentRoomId = await getCurrentRoom(userId);
              if(currentRoomId !== undefined){
                await leaveGameRoom(currentRoomId, userId);
              }
              const joinSql = `UPDATE games SET player2_id = ?, socketId2 = ? WHERE id = ?`;
              db.run(joinSql, [userId, socketId, roomId], function (joinErr) {
                if (joinErr) {
                  reject(joinErr);
                } else {
                  // Fetch the updated row after the update operation
                  const updatedRowSql = `SELECT * FROM games WHERE id = ?`;
                  db.get(updatedRowSql, [roomId], (updatedRowErr, updatedRow) => {
                    if (updatedRowErr) {
                      reject(updatedRowErr);
                    } else {
                      resolve(updatedRow);
                    }
                  });
                }
              });
            } else {
              resolve('You are already joined to this room!');
            }
          });
        });
      }
      

   function leaveGameRoom(roomId, userId, socketId) {
      const findSql = `SELECT * FROM games WHERE id = ?`;
      const updateSql = `UPDATE games 
      SET 
          player1_id = CASE WHEN player1_id = ? THEN NULL ELSE player1_id END, 
          socketId1 = CASE WHEN player1_id = ? THEN NULL ELSE socketId1 END,
          player2_id = CASE WHEN player2_id = ? THEN NULL ELSE player2_id END,
          socketId2 = CASE WHEN player2_id = ? THEN NULL ELSE socketId2 END
      WHERE 
          id = ?`;
    
      return new Promise((resolve, reject) => {
        db.get(findSql, [roomId], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(row)
          if (row.player1_id === userId || row.player2_id === userId) {
            db.run(updateSql, [userId, userId, userId, userId, roomId], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve('Successfully left the room!');
              }
            });
          } else {
            resolve('You are not connected to this room!');
          }
        });
      });
    }

    function startGame(roomId){
      const findSql = `SELECT player1_id FROM games WHERE id = ?`;
      const sql = `UPDATE player_throwing WHERE player1_id = ?`
      const player1_id = new Promise((resolve, reject) => {
          db.get(findSql, [roomId], (err, row) =>{
          if(err)reject(err)
          else{resolve(row.player1_id)}
        })
      });

      return new Promise((resolve, reject) => {
        db.run(sql,[player1_id],(err) => {
          if(err)reject(err)
          else{resolve(`Player1 can start throwing!`)}
        })
      })
    }

    function getGameRoom(roomId){
      const sql = `SELECT * FROM games WHERE id = ?`
      return new Promise((resolve, reject) => {
          db.get(sql,[roomId], (err, row) => {
              if(err) reject(err)
              else{resolve(row)}
          })
      })
    }

    function getGameRooms(){
      const sql = `SELECT * FROM games`
      return new Promise(( resolve, reject) => {
        db.all(sql,(err,rows)=>{
          if(err) resolve(err)
          resolve(rows)
        })
      })      
   
    }

    async function getCurrentRoom(userId){
      const getCurrentSql = 'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?';
      console.log("userid",userId)
      return new Promise((resolve,reject) => {
        db.get(getCurrentSql, [userId, userId], (err, row) => {
          console.log("row:", row)
          if(row === undefined) {
            console.log("reject")
            resolve(undefined)
          }
          else {
            resolve(row.id) 
          }
        });
      })
    }

    function joinedToRoom(userId, roomId){
      console.log("fthifthéos",userId, roomId)
      const sql = `
          SELECT * FROM games
          WHERE
          (player1_id = ? OR player2_id = ?) AND
          id = ?`;
      
      return new Promise((resolve, reject) => {
          db.get(sql, [userId, userId, roomId], (err, row) => {
              if (err) {
                  reject(err);
              } else {
                console.log("rooooooooooooooow",row)
                  if (row) {
                    console.log("true")
                      resolve(true); 
                  } else {
                      resolve(false); 
                  }
              }
          });
      });
    }

    function timerDown(roomId){
      const getSQL = `SELECT timer FROM games WHERE id = ?`;
      const updateSQL = `UPDATE games SET timer = timer - 1 WHERE id = ?`

      return new Promise((resolve, reject) => {
        db.get(getSQL, [roomId], (err,row) => {
          if(err) reject(err)
          else{
            db.run(updateSQL, [roomId], (err) => {
              if(err) reject(err)
            })
            resolve(row.timer - 1)
          }
        })
      })
    }

    function resetTimer(roomId){
      const updateSQL = `UPDATE games SET timer = 10 WHERE id = ?`
      return new Promise((resolve, reject) => {
        db.run(updateSQL, [roomId], (err) => {
          if(err) reject(err)
          else{
            resolve(10)
          }
        })
      })
    }


    export {
      createGameRoom,
      createGamesTable,
      joinGameRoom,
      leaveGameRoom,
      deleteGameRoom,
      setIoGames,
      startGame,
      getGameRooms,
      getGameRoom,
      joinedToRoom,
      timerDown,
      resetTimer
    }
    
