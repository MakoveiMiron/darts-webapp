import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./Layout/PublicLayout";
import Test from "./test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },
]);

export default router;
