import { getEmail, createUser} from "../database/models/users-model"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../constants";
import HttpError from "../utils/httpError";

export default {
    login({email,password}){
        if(!email || !password) throw new HttpError('Missing required parameter', 400);

        return getEmail(email)
        .then((userWithPwHash) => {
            console.log(`hash jelszo: `,userWithPwHash);
            const {passwordHash, ...user} = userWithPwHash
            console.log(`user`, user)
            const isValidPassword = bcrypt.compareSync(password, passwordHash)

            if(!isValidPassword) throw new HttpError('Invalid email or password',400);
            const token = jwt.sign(user, JWT_SECRET_KEY, {expiresIn: '8h'})
            return { accesToken: token}
        })
    },
    register({ email, password, username }){
        if(!email || !password) throw new HttpError('Missing required parameter', 400);
        if(password.length < 4) throw new HttpError('Too short password', 400);
    
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password,salt);
        
        return createUser({email, passwordHash, username})
    }
}