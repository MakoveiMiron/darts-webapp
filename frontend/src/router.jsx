import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/public/Layout/PublicLayout";
import Game from "./components/public/Game/Game";
import HomePage from "./pages/HomePage";
import Login from "./components/public/Login/Login";
import Register from "./components/public/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: `/game/:roomId`,
        element: <Game />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/register",
        element: <Register/>
      }
    ],
  },
]);

export default router;
