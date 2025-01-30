import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

import { logout } from "../client/auth";
import { searchDocuments } from "../client/document";
import { EDIT_ITEMS, FILE_ITEMS, INSERT_ITEMS } from "../constants/Navbar";
import { navbarActions } from "../store/slices/navbar";
import { documentActions } from "../store/slices/document";
import { modalActions } from "../store/slices/modal";
import { drawerActions } from "../store/slices/drawer";
import { RootState } from "../store";
import Dropdown from "./Dropdown";
import Button from "./Button";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchDocuments = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await searchDocuments("title", searchRef.current?.value as string);
    }
  };

  const disabledActions = useSelector(
    (state: RootState) => state.navbar.disabledActions
  );

  const document = useSelector(
    (state: RootState) => state.document.viewingDocument
  );

  const documentTitle = useRef<HTMLInputElement>(null);

  const isEditorPage = location.pathname.includes("/editor");

  const handleOnTitleInput = () => {
    dispatch(
      documentActions.setViewingDocument({
        ...document,
        title: documentTitle.current?.value,
      })
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleMenuItemClick = (item: string) => {
    dispatch(navbarActions.setNavAction(item));

    switch (item) {
      case "Rename":
        documentTitle.current?.focus();
        documentTitle.current?.select();
        break;
      case "Open":
        dispatch(modalActions.enableOkBtn(false));
        dispatch(
          modalActions.showModal({
            title: "Open File",
            text: "",
            okText: "Add",
            slot: "OpenFile",
          })
        );
        break;
      default:
        break;
    }
  };

  const handleSubMenuItemClick = (item: string) => {
    dispatch(navbarActions.setNavAction(item));
  };

  const handleOnShare = () => {
    dispatch(
      modalActions.showModal({
        title: `Share "${document.title}"`,
        text: "",
        okText: "Ok",
        slot: "ShareDocument",
        payload: document.id,
        modalClass: "!max-w-3xl !h-[400px] !min-h-[400px] !overflow-y-none",
      })
    );
  };

  const handleToggleDrawer = () => {
    dispatch(drawerActions.toggleDrawer());
  };

  return (
    <>
      <div className="navbar bg-base-100 border border-b-slate-600  backdrop-filter backdrop-blur-lg sticky h-auto top-0 left-0 z-50">
        <div className="flex-none">
          <a className="btn btn-ghost text-5xl" onClick={() => navigate("/")}>
            <i className="fa-solid fa-hashtag"></i>
          </a>
        </div>

        {isEditorPage && (
          <div className="flex-none self-start flex flex-col gap-1">
            <input
              type="text"
              placeholder="Type here"
              className="input h-1/2 max-w-xs input-ghost font-semibold"
              defaultValue={document.title}
              ref={documentTitle}
              onInput={handleOnTitleInput}
            />
            <div className="flex mr-auto gap-1">
              <Dropdown
                activatorClass="btn-xs"
                title="File"
                items={FILE_ITEMS}
                menuItemClick={handleMenuItemClick}
                subMenuItemClick={handleSubMenuItemClick}
              />
              <Dropdown
                activatorClass="btn-xs"
                title="Edit"
                items={EDIT_ITEMS}
                menuItemClick={handleMenuItemClick}
                subMenuItemClick={handleSubMenuItemClick}
                disabledActions={disabledActions}
              />
              <Dropdown
                activatorClass="btn-xs"
                title="Insert"
                items={INSERT_ITEMS}
                menuItemClick={handleMenuItemClick}
                subMenuItemClick={handleSubMenuItemClick}
              />
            </div>
          </div>
        )}

        {!isEditorPage && (
          <div className="flex-grow flex justify-center gap-1">
            <label className="input input-bordered flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="grow w-[500px]"
                placeholder="Search"
                ref={searchRef}
                onKeyDown={handleSearchDocuments}
              />
              <kbd className="kbd kbd-sm">Enter</kbd>
            </label>
          </div>
        )}

        <div className="flex-none ml-auto">
          {isEditorPage && (
            <div className="flex gap-2">
              <Button
                icon="clock-rotate-left"
                tooltipName="History"
                tooltipLoc="bottom"
                className="btn-circle"
                onClick={handleToggleDrawer}
              />

              <Button
                title="Share"
                className="rounded-full bg-slate-200 mr-3"
                icon="share"
                iconSize="md"
                hasTextAndIcon
                onClick={handleOnShare}
              ></Button>
            </div>
          )}
          <div className="dropdown dropdown-end">
            <Button icon="user" variant="circle"></Button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-auto p-2 shadow"
            >
              <div className="p-2 flex flex-nowrap gap-3 items-center">
                <span>{user.email}</span>
              </div>

              <div className="divider m-0"></div>
              <li>
                <a onClick={handleLogout}>
                  {" "}
                  <span className="fa-solid fa-right-from-bracket"></span>{" "}
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
