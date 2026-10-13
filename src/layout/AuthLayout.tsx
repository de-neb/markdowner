import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Toast from "../components/Toast";
import Loader from "../components/Loader";

export default function DefaultLayout() {
  const session = useSelector((state: RootState) => state.session.session);

  if (session?.accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative min-h-svh w-full">
      <Outlet />
      <Toast />
      <Loader />
    </div>
  );
}
