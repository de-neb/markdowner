import { Outlet } from "react-router";
import Toast from "../components/Toast";

export default function DefaultLayout() {
  return (
    <>
      <Outlet></Outlet>
      <Toast />
    </>
  );
}
