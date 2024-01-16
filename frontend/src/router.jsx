import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/public/Layout/PublicLayout";
import Test from "./test";
import Login from "./components/public/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
