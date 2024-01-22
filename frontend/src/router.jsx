import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/public/Layout/PublicLayout";
import Game from "./components/public/Game/Game";
import Home from "./components/public/Home/Home";
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
        element: <Home />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
