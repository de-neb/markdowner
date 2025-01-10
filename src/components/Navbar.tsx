import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

import { logout } from "../client/auth";
import { EDIT_ITEMS, FILE_ITEMS, INSERT_ITEMS } from "../constants/Navbar";
import { navbarActions } from "../store/slices/navbar";
import { documentActions } from "../store/slices/document";
import { RootState } from "../store";
import Dropdown from "./Dropdown";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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

      default:
        break;
    }
  };

  const handleSubMenuItemClick = (item: string) => {
    dispatch(navbarActions.setNavAction(item));
  };

  return (
    <div className="navbar bg-base-100 border border-b-slate-200 sticky h-auto top-0 left-0 z-50">
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
            />
          </label>
        </div>
      )}

      <div className="flex-none ml-auto">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <i className="fa-solid fa-user text-xl mt-2"></i>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
