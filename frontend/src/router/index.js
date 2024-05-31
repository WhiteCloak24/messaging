import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import CheckAuthorizationLayout from "../layout/CheckAuthorizationLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CheckAuthorizationLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
]);
