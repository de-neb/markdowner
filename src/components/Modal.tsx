import { useEffect, useRef } from "react";
import { modalActions } from "../store/slices/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import Button from "./Button";
import ModalDetails from "./ModalDetails";
import Loader from "./Loader";

export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { isVisible, modalOptions, enableOkBtn } = useSelector(
    (state: RootState) => state.modal,
  );
  const dispatch = useDispatch();

  const handleClose = (result: boolean) => {
    dispatch(modalActions.setIsConfirmed(result));
    dispatch(modalActions.hideModal());
  };

  const handleOnValueChange = (value: string) => {
    dispatch(modalActions.setRefValue(value));
  };

  useEffect(() => {
    if (isVisible) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      dispatch(modalActions.resetModal());
    }
  }, [isVisible, dispatch]);

  return (
    <dialog className="modal" ref={dialog}>
      <div
        className={`modal-box relative ${modalOptions?.modalClass} overflow-y-auto border border-base-300 bg-base-100 p-0 text-base-content shadow-2xl`}
      >
        <h3 className="sticky left-0 top-0 z-50 bg-base-100 p-3 text-lg font-bold text-base-content">
          {modalOptions?.title}
        </h3>
        <div className="relative z-0 min-h-48">
          <p className="px-6 py-4 text-base-content">
            {modalOptions?.text}
            {modalOptions?.slot && (
              <ModalDetails
                slot={modalOptions.slot}
                onValueChange={handleOnValueChange}
              />
            )}
          </p>
        </div>
        <div className="modal-action absolute bottom-0 left-0 right-0 z-10 mt-2 w-full border-t border-base-300 bg-base-200/90 p-3 text-base-content backdrop-blur-sm">
          <form method="dialog" className="flex gap-2">
            <Button
              title={modalOptions?.cancelText ?? "Cancel"}
              onClick={() => handleClose(false)}
            />
            {modalOptions?.okText && (
              <Button
                title={modalOptions?.okText ?? "Ok"}
                variant="primary"
                onClick={() => handleClose(true)}
                disabled={!enableOkBtn}
              />
            )}
          </form>
        </div>
      </div>

      <Loader />
    </dialog>
  );
}
