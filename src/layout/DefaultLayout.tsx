import { Navigate, Outlet } from "react-router";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

export default function DefaultLayout() {
  const session = useSelector((state: RootState) => state.session.session);

  if (!session?.accessToken) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Toast />
      <Loader />
      <Modal />
    </>
  );
}
