import { useContext } from "react";
import AuthContext from "../contexts/authProvider";
import authFetches from "../services/auth-fetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate()
  function login(formData) {
    console.log("1")
    authFetches.userLogin(formData).then((resp) => {
      console.log("frontend resp",resp)
      setAuth((prev) => ({ ...prev, accessToken: resp.accesToken.accesToken }));
      localStorage.setItem("accessToken", resp.accesToken.accesToken);
      console.log("accessToken after login:", resp.accesToken);
      toast.success("Sikeres bejelentkezés");
      navigate('/');
    });
  }

  function register(formData){
    authFetches.userRegister(formData).then((resp) => {
      login(formData)
      navigate("/")
    })
  }

  function logout() {
    localStorage.removeItem("accessToken");
    // Töröld a korábbi felhasználói adatokat is
    setAuth({ accessToken: null, user: null });
    toast.success("Kijelentkezve");
  }
  return { ...auth, login, logout, register };
};

export default useAuth;
