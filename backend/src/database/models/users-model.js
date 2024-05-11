import { nanoid } from 'nanoid';
import {db} from '../connection';

    let io;

    function setIoUsers(socketIo) {
        io = socketIo;
    }
    function createUsersTable(){
        const sql = `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(16) PRIMARY KEY,
            email VARCHAR(32) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            signed_in BOOLEAN DEFAULT FALSE,
            username VARCHAR(16) UNIQUE,
            is_admin BOOLEAN DEFAULT FALSE,
            inGame BOOLEAN DEFAULT FALSE,
            points INTEGER DEFAULT 0
        )`;
        db.run(sql, (err) => {
            if(err){
                console.log(`Error while creating users table! ${err.message}`)
                throw err;
            }
        });
    }

   function updateUser({email, passwordHash, username}){
        const id = nanoid(16);    
        const sql = `UPDATE users SET id = ?, email = ?, password_hash = ?, username = ?`;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [id,email,passwordHash,username], (err) => {
                if(err) reject(err);
                else{
                    resolve({id, email})
                }
            });
        });
    }

   async function getUsernamesById(myId, opponentId){
        console.log("2- ids",myId,opponentId)
        let user1 = await getUserDataById(myId)
        let user2 = await getUserDataById(opponentId)

        console.log("users", user1, user2)
        if(user1 !== undefined && user2 !== undefined){
            return{user1: {username1: user1?.username , user1Id: myId}, user2: {username2: user2?.username, user2Id: opponentId}}
        }
        else if(user1 !== undefined && user2 === undefined){
            return{user1: {username1: user1?.username, user1Id: myId}, user2: {username2: "No opponent", user2Id: opponentId}}
        }
        else{
            return{user1: {username1: "No opponent" , user1Id: myId}, user2: {username2: user2?.username, user2Id: opponentId}}
        }
    }

    function getUserDataById(id){
        const sql = `SELECT * FROM users WHERE id = ?`
        return new Promise((resolve,reject) => {
            db.get(sql,[id], (err, row) => {
                if(err) reject(err)
                else{
                    resolve(row);
                }
            });
        });
    }

   function createUser({email, passwordHash, username}){
        const id = nanoid(16)
        const sql = `INSERT INTO users (id,email,password_hash,username) VALUES($id,$email,$passwordHash,$username)`
        const params = {$id: id, $email: email, $passwordHash: passwordHash, $username: username}

        return new Promise((resolve,reject) => {
            db.run(sql,params, (err) => {
                if(err) reject(err);
                else{
                    resolve({id, email});
                }
            });
        });
    }
   function getEmail(email){
        const sql = `SELECT * FROM users WHERE email = ?`

        return new Promise((resolve,reject) => {
            db.get(sql,[email], (err, row) => {
                if(err) reject(err)
                else if(row){
                    const {id, password_hash: passwordHash, is_admin: isAdmin} = row;
                    resolve({id,email,passwordHash,isAdmin})
                }
                else{
                    reject(err)
                }
            })
        })

    }
    export {
        createUsersTable,
        updateUser,
        getUserDataById,
        createUser,
        getEmail,
        setIoUsers,
        getUsernamesById
    }
