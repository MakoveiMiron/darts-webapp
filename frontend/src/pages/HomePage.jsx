import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import Home from '../components/public/Home/Home';
export default function HomePage(){
    const { user } = useAuth();
    const userId = user?.id;

    console.log(user, userId)
    const navigate = useNavigate()
    if(userId === undefined){
       navigate('/user/login')
    } 
    else{
        return <Home/>
    }
}