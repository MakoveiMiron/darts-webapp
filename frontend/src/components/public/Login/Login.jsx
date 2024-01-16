import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login(formData);
    navigate("/");
  }

  return (
    <>
      <main className="loginMain">
        <section>
          {/* <h1>Login</h1> */}
          <div className="wrapper">
            <form onSubmit={handleSubmit}>
              <div>
                <h1 className="login-h1">Bejelentkezés</h1>
                <p>
                  E-mail:{" "}
                  <input
                    className="login-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </p>
                <p>
                  Jelszó:{" "}
                  <input
                    className="login-input"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      console.log(formData);
                    }}
                    required
                  />
                </p>
                <p>
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
