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
    <div className="h-screen w-screen relative">
      <Outlet />
      <Toast />
      <Loader />
    </div>
  );
}
