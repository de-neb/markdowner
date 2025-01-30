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
    (state: RootState) => state.modal
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
        className={`modal-box relative ${modalOptions?.modalClass} p-0 overflow-y-auto`}
      >
        <h3 className="font-bold text-lg sticky left-0 top-0 bg-white p-3 z-50">
          {modalOptions?.title}
        </h3>
        <div className="relative min-h-48 z-0">
          <p className="py-4 px-6">
            {modalOptions?.text}
            {modalOptions?.slot && (
              <ModalDetails
                slot={modalOptions.slot}
                onValueChange={handleOnValueChange}
              />
            )}
          </p>
        </div>
        <div className="modal-action w-full mt-2 absolute bottom-0 left-0 right-0 bg-white p-3">
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
