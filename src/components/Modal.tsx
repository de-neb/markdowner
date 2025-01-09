import { useEffect, useRef } from "react";
import { modalActions } from "../store/slices/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import Button from "./Button";

// slots
const SlotRender = ({
  slot,
  onValueChange,
}: {
  slot: string | null;
  onValueChange: (value: string) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);

  const handleOnInput = () => {
    if (input.current) {
      onValueChange(input.current.value);
    }
  };

  switch (slot) {
    case "RenameInput":
      return (
        <input
          type="text"
          className="input input-bordered input-primary input-sm w-full mt-4"
          ref={input}
          onBlur={handleOnInput}
        />
      );

    default:
      return null;
  }
};

export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { isVisible, modalOptions } = useSelector(
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
  }, [isVisible]);

  return (
    <dialog className="modal" ref={dialog}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{modalOptions?.title}</h3>
        <p className="py-4">
          {modalOptions?.text}
          {modalOptions?.slot && (
            <SlotRender
              slot={modalOptions.slot}
              onValueChange={handleOnValueChange}
            />
          )}
        </p>
        <div className="modal-action mt-2">
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
              />
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
}
