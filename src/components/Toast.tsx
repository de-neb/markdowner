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

  const toastClass = (type: string = "primary") => {
    return `rounded-lg relative flex flex-nowrap items-center alert alert-${type}`;
  };

  useEffect(() => {
    const intervals = toastMessages.map((toast) =>
      toast.show && toast.value > 0
        ? setInterval(() => {
            dispatch(toastActions.decreaseProgressValue(toast.id));
          }, 100)
        : null
    );

    return () => {
      intervals.forEach((interval) => interval && clearInterval(interval));
    };
  }, [toastMessages, dispatch]);

  return (
    <>
      {toastMessages.length
        ? toastMessages.map((toast) =>
            toast.show ? (
              <div className="toast toast-end" key={toast.id}>
                <div className={toastClass(toast.type)}>
                  <span className="text-white">{toast.message}</span>
                  <button
                    className="btn btn-circle btn-ghost"
                    onClick={() => handleToastClose(toast.id)}
                  >
                    {" "}
                    <i className="text-white text-xl fa-solid fa-xmark"></i>
                  </button>

                  <progress
                    className="progress absolute bottom-0 left-0 w-100 h-1 rounded-lg"
                    value={toast.value}
                    max="100"
                  ></progress>
                </div>
              </div>
            ) : null
          )
        : null}
    </>
  );
}
