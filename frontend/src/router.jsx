import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/public/Layout/PublicLayout";
import Game from "./components/public/Game/Game";
import HomePage from "./pages/HomePage";
import Login from "./components/public/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/game",
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
    ],
  },
]);

export default router;
