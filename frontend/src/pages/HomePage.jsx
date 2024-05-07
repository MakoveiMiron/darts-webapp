import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import Home from '../components/public/Home/Home';
export default function HomePage(){
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate()
    console.log(accessToken)
    if(accessToken === null){
        navigate("/user/login")
    }
    else{
        return <Home/>
    }

}