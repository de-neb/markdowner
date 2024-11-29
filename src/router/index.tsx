import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Editor from "../pages/Editor";
import Profile from "../pages/Profile";
import { createBrowserRouter } from "react-router";

const routes = [
  {
    path: "/",
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
