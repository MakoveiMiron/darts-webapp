import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./contexts/authProvider";

export default function App() {
  return (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  );
}
