import { RouterProvider } from "react-router";
import router from "./router/index";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
