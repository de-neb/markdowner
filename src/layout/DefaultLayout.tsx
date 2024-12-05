import { Navigate, Outlet } from "react-router";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

export default function DefaultLayout() {
  const session = useSelector((state: RootState) => state.session.session);

  if (!session?.accessToken) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="h-full w-full relative">
      <Navbar />
      <Outlet />
      <Toast />
      <Loader />
    </div>
  );
}
