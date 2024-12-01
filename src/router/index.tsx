// utils
import { createBrowserRouter } from "react-router";

// pages
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Editor from "../pages/Editor";
import Profile from "../pages/Profile";

// layouts
import DefaultLayout from "../layout/DefaultLayout";

const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },

  {
    path: "/editor",
    children: [
      {
        path: "",
        element: <Editor />,
      },
    ],
  },

  {
    path: "/profile",
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/auth",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <Auth />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
