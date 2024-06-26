import { createBrowserRouter } from "react-router-dom";
import CheckAuthorizationLayout from "../layout/CheckAuthorizationLayout";
import AuthorizedLayout from "../layout/AuthorizedLayout";
import UnauthorizedLayout from "../layout/UnauthorizedLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CheckAuthorizationLayout />,
    children: [
      {
        path: "/home",
        element: <AuthorizedLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
      {
        path: "/",
        element: <UnauthorizedLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
    ],
  },
]);
