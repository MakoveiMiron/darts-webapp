import { nanoid } from 'nanoid';
import db from '../connection';

export default {
    createTable(){
        const sql = `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(16) PRIMARY KEY,
            email VARCHAR(32) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
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
    },

    updateUser({email, passwordHash, username}){
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
    },

    getUserDataById({id}){
        const sql = `SELECT * FROM users WHERE id = ?`
        return new Promise((resolve,reject) => {
            db.get(sql,[id], (err, row) => {
                if(err) reject(err)
                else{
                    resolve(row);
                }
            });
        });
    },
    createUser({email, passwordHash, username}){
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
    },
    getEmail(email){
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
}