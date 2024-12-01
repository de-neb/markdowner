import { useDispatch, useSelector } from "react-redux";
import { toastActions } from "../store/slices/toast";
import { RootState } from "../store";
import { useEffect } from "react";

export default function Toast() {
  const dispatch = useDispatch();
  const { toastMessages } = useSelector((state: RootState) => state.toast);

  const handleToastClose = (id: string) => {
    dispatch(toastActions.close(id));
  };

  useEffect(() => {
    const timers = toastMessages.map((toast) =>
      toast.show
        ? setTimeout(() => {
            console.log("did this run");
            dispatch(toastActions.close(toast.id));
          }, toast.duration)
        : null
    );

    const intervals = toastMessages.map((toast) =>
      toast.show && toast.value > 0
        ? setInterval(() => {
            console.log("running");
            dispatch(toastActions.decreaseProgressValue(toast.id));
          }, 100)
        : null
    );

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
      intervals.forEach((interval) => interval && clearInterval(interval));
    };
  }, [toastMessages, dispatch]);
  return (
    <>
      {toastMessages.length
        ? toastMessages.map((toast) =>
            toast.show ? (
              <div className="toast toast-end" key={toast.id}>
                <div
                  className={`relative items-center alert alert-${toast.type}`}
                >
                  <span className="text-white">{toast.message}</span>
                  <button
                    className="btn btn-circle btn-ghost"
                    onClick={() => handleToastClose(toast.id)}
                  >
                    {" "}
                    <i className="text-white text-xl fa-solid fa-xmark"></i>
                  </button>

                  <progress
                    className="progress absolute bottom-0 left-0 w-100"
                    value={toast.value}
                    max="100"
                  ></progress>
                </div>
              </div>
            ) : undefined
          )
        : undefined}
    </>
  );
}
