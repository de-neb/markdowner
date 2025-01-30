import { Navigate, Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import History from "../components/History";
import { logout } from "../client/auth";

export default function DefaultLayout() {
  const session = useSelector((state: RootState) => state.session.session);
  const navigate = useNavigate();

  if (!session?.accessToken) {
    return <Navigate to="/auth" />;
  }

  const handleSessionTimeout = async () => {
    localStorage.clearItem("loginTime");
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const currentTime = Date.now();
    const sessionDuration = 1 * 10 * 1000;

    if (loginTime) {
      const timeElapsed = currentTime - parseInt(loginTime);
      const timeRemaining = sessionDuration - timeElapsed;

      if (timeRemaining <= 0) {
        handleSessionTimeout();
      } else {
        const timer = setTimeout(() => {
          handleSessionTimeout();
        }, timeRemaining);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Toast />
      <Loader />
      <Modal />
      <History />
    </>
  );
}
