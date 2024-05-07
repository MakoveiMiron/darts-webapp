import "./Nav.css";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate()
  const accesToken = localStorage.getItem("accessToken")
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        {accesToken || (location.pathname).includes("/user/register") ? null : <li onClick={() => navigate("/user/register")} className="nav-item">Register</li>}
        {accesToken || (location.pathname).includes("/user/login") ? null: <li onClick={() => navigate("/user/login")} className="nav-item">Login</li>}
        {!accesToken ? null : <li onClick={() => {localStorage.removeItem("accessToken"); location.reload() }} className="nav-item">Logout</li>}
      </ul>
    </nav>
  );
}