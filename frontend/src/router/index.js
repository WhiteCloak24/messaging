import { createBrowserRouter } from "react-router-dom";
import UnauthorizedLayout from "../layout/UnauthorizedLayout";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UnauthorizedLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
]);
