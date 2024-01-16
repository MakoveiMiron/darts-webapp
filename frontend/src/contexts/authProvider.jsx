import { createContext, useEffect, useState } from "react";
import { createAuthInit } from "../services/auth-fetch";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(createAuthInit());

  useEffect(() => {
    if (auth.accessToken) {
      console.log("accessToken in AuthProvider:", auth.accessToken);
      const decoded = jwtDecode(auth.accessToken);
      setAuth((prev) => ({ ...prev, user: { ...decoded } }));
    }
  }, [auth.accessToken]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
