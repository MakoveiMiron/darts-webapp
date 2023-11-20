import authService from "../services/auth-service"

export default {
    login(req, res, next){
        const { email, password } = req.body 
        authService
            .login({email, password})
            .then(({ accesToken }) => {
                res.status(200).send({ accesToken });
            })
            .catch(next)
    },
    register(req, res, next){
        const { email, password, username } = req.body 
        authService
            .register({email, password, username})
            .then((user) => {
                res.status(200).send(user);
            })
            .catch(next)
    }
}