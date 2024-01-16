import { useContext } from "react";
import AuthContext from "../contexts/authProvider";
import authFetches from "../services/auth-fetch";
import { toast } from "react-toastify";

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);

  function login(formData) {
    authFetches.userLogin(formData).then((resp) => {
      setAuth((prev) => ({ ...prev, accessToken: resp.accessToken }));
      localStorage.setItem("accessToken", resp.accessToken);
      console.log("accessToken after login:", resp.accessToken);
      toast.success("Sikeres bejelentkezés");
      // navigate('/');
    });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    // Töröld a korábbi felhasználói adatokat is
    setAuth({ accessToken: null, user: null });
    toast.success("Kijelentkezve");
  }
  return { ...auth, login, logout };
};

export default useAuth;
