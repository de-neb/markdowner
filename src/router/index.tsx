// utils
import { createBrowserRouter } from "react-router";

// pages
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Editor from "../pages/Editor";
import Profile from "../pages/Profile";
import Error from "../pages/Error";

// layouts
import DefaultLayout from "../layout/DefaultLayout";
import AuthLayout from "../layout/AuthLayout";

const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/editor/:documentId",
        element: <Editor />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Auth />,
      },
    ],
  },

  {
    path: "*",
    element: <Error />,
  },
];

const router = createBrowserRouter(routes);

export default router;
