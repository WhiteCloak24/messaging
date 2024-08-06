import { createBrowserRouter } from "react-router-dom";
import CheckAuthorizationLayout from "../layout/CheckAuthorizationLayout";
import AuthorizedLayout from "../layout/AuthorizedLayout";
import UnauthorizedLayout from "../layout/UnauthorizedLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import General from "../pages/Profile/General";

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
        path: "/profile",
        element: <AuthorizedLayout />,
        children: [
          {
            path: "general-settings",
            element: (
              <Profile>
                <General />
              </Profile>
            ),
          },
          {
            path: "*",
            element: (
              <Profile>
                <div className="bg-white w-full m-4 rounded-xl">Coming Soon...</div>
              </Profile>
            ),
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
