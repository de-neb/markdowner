import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { useEffect } from "react";

import { RootState } from "../store";
import { drawerActions } from "../store/slices/drawer";
import { getDocumentHistory } from "../client/document";
import { formatDate } from "../utils/misc";

export default function History() {
  const showDrawer = useSelector((state: RootState) => state.drawer.showDrawer);
  const history = useSelector((state: RootState) => state.document.history);
  const documentId = useSelector(
    (state: RootState) => state.document.viewingDocument.id
  ) as string;
  const dispatch = useDispatch();

  const handleOnCheckboxChange = () => {
    dispatch(drawerActions.toggleDrawer());
  };

  useEffect(() => {
    const loadDocumentHistory = async () => {
      await getDocumentHistory(documentId);
    };
    if (showDrawer) {
      loadDocumentHistory();
    }
  }, [showDrawer, documentId]);

  return createPortal(
    <div className="drawer drawer-end z-[100000]">
      <input
        id="history-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={showDrawer}
        onChange={handleOnCheckboxChange}
      />
      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="history-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 text-center">
          {/* Sidebar content here */}
          <h1 className="text-2xl font-semibold mb-3 text-start">History</h1>

          {history && history.length ? (
            history.map((activity) => (
              <li key={activity.id}>
                <div className="flex flex-col items-start gap-0">
                  <h2 className="text-md font-semibold">
                    {formatDate(activity.action_timestamp, {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </h2>
                  <span className="text-slate-500 text-sm">
                    {activity.user_email}
                  </span>
                  <span>{activity.action}</span>
                  <span></span>
                </div>
              </li>
            ))
          ) : (
            <span>No records to show.</span>
          )}
        </ul>
      </div>
    </div>,
    document.getElementById("root")
  );
}
