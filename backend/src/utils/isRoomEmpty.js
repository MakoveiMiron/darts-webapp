import db from "../database/connection";

async function isRoomEmpty(roomId){
    const sql = `SELECT * FROM games WHERE id = ? AND (player1_id IS NULL AND player2_id IS NULL)`;
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
export default isRoomEmpty