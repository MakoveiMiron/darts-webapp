import db from "../database/connection";

async function isRoomFull(roomId){
    const sql = `SELECT * FROM games WHERE id = ? AND (player1_id IS NOT NULL AND player2_id IS NOT NULL)`;
    return new Promise((resolve, reject)=> {
        db.get(sql, [roomId], (err, row) => {
                if (!row) {
                    resolve(false)
                } 
                else {
                    resolve(true);
                }
            }
        )
    })
}