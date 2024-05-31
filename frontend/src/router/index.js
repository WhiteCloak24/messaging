import { createBrowserRouter } from "react-router-dom";
import CheckAuthorizationLayout from "../layout/CheckAuthorizationLayout";
import AuthorizedLayout from "../layout/AuthorizedLayout";
import UnauthorizedLayout from "../layout/UnauthorizedLayout";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CheckAuthorizationLayout />,
    children: [
      {
        path: "/home",
        element: <AuthorizedLayout />,
      },
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
    ],
  },
]);
