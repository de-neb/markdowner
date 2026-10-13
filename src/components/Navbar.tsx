import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

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
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return (
      globalThis.document?.documentElement.getAttribute("data-theme") !==
      "lemonade"
    );
  });

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchDocuments = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      await searchDocuments("title", searchRef.current?.value as string);
    }
  };

  const disabledActions = useSelector(
    (state: RootState) => state.navbar.disabledActions,
  );

  const viewingDocument = useSelector(
    (state: RootState) => state.document.viewingDocument,
  );

  const documentTitle = useRef<HTMLInputElement>(null);

  const isEditorPage = location.pathname.includes("/editor");

  const handleOnTitleInput = () => {
    dispatch(
      documentActions.setViewingDocument({
        ...viewingDocument,
        title: documentTitle.current?.value,
      }),
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
          }),
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
        title: `Share "${viewingDocument.title}"`,
        text: "",
        okText: "Ok",
        slot: "ShareDocument",
        payload: viewingDocument.id,
        modalClass: "!max-w-3xl !h-[400px] !min-h-[400px] !overflow-y-none",
      }),
    );
  };

  const handleToggleDrawer = () => {
    dispatch(drawerActions.toggleDrawer());
  };

  const toggleTheme = () => {
    const nextTheme = isDarkTheme ? "lemonade" : "forest";
    setIsDarkTheme(!isDarkTheme);
    globalThis.document?.documentElement.setAttribute("data-theme", nextTheme);
    globalThis.document?.documentElement.style.setProperty(
      "color-scheme",
      nextTheme === "forest" ? "dark" : "light",
    );
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "lemonade" || theme === "forest") {
      setIsDarkTheme(theme === "forest");
      globalThis.document?.documentElement.setAttribute("data-theme", theme);
      globalThis.document?.documentElement.style.setProperty(
        "color-scheme",
        theme === "forest" ? "dark" : "light",
      );
    }
  }, []);

  return (
    <>
      <div className="navbar sticky top-0 left-0 z-50 h-auto flex-nowrap items-center gap-2 border border-b-slate-600 bg-base-100/90 backdrop-blur-lg">
        <div className="flex-none shrink-0">
          <a className="btn btn-ghost text-5xl" onClick={() => navigate("/")}>
            <i className="fa-solid fa-hashtag"></i>
            {!isEditorPage && (
              <span className="text-[20px] font-mono">Markdowner</span>
            )}
          </a>
        </div>

        {isEditorPage && (
          <div className="flex-none self-start flex flex-col gap-1">
            <input
              type="text"
              placeholder="Type here"
              className="input h-1/2 max-w-xs input-ghost font-semibold"
              defaultValue={viewingDocument.title}
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
          <div className="flex min-w-0 flex-1 justify-center px-2">
            <div className="input input-bordered flex w-full max-w-lg items-center gap-2">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="grow border-0 bg-transparent p-0 shadow-none outline-none focus:outline-none"
                placeholder="Search"
                ref={searchRef}
                onKeyDown={handleSearchDocuments}
              />
              <kbd className="kbd kbd-sm hidden sm:inline-flex">Enter</kbd>
            </div>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap">
          {isEditorPage && (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Button
                icon="clock-rotate-left"
                tooltipName="History"
                tooltipLoc="bottom"
                className="btn-circle"
                onClick={handleToggleDrawer}
              />

              <Button
                title="Share"
                variant="secondary"
                className="rounded-full"
                icon="share"
                iconSize="md"
                hasTextAndIcon
                onClick={handleOnShare}
              ></Button>
            </div>
          )}
          <button
            type="button"
            className="btn btn-circle btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={`fa-solid ${isDarkTheme ? "fa-sun" : "fa-moon"}`}></i>
          </button>
          <div className="dropdown dropdown-end flex shrink-0 items-center">
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
