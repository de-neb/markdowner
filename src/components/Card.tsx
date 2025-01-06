import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/slices/modal";
import { MarkdownerDocument } from "../client/type";
import { stringToMarkdown } from "../utils/parse";
import { formatDate } from "../utils/misc";
import { RootState } from "../store";
import { renameDocumentTitle } from "../client/document";

type CardProps = {
  document: MarkdownerDocument;
  children?: React.ReactNode;
  options?: any[];
};

export default function Card({ children, options, ...props }: CardProps) {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal);
  const [markdownPreview, setMarkdownPreview] = useState("");
  const document = props.document;

  const setOpenedDateOrTime = (openedDate: string) => {
    const newOpenedDate = new Date(openedDate);
    const today = new Date();

    if (
      newOpenedDate.getDate() === today.getDate() &&
      newOpenedDate.getMonth() === today.getMonth() &&
      newOpenedDate.getFullYear() === today.getFullYear()
    ) {
      return formatDate(openedDate, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return formatDate(openedDate);
  };

  const handleMoreOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleOptionClick = async (e: React.MouseEvent, option: string) => {
    e.stopPropagation();

    switch (option) {
      case "Remove":
        break;
      case "Rename":
        dispatch(
          modalActions.showModal({
            title: "Rename",
            text: "Please enter a new name for the item:",
            okText: "Ok",
            slot: "RenameInput",
            payload: document.id,
          })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const renameDocument = async () => {
      await renameDocumentTitle(modal.refValue, document.id!);
    };

    if (
      modal.isConfirmed &&
      modal.refValue &&
      document.id === modal.modalOptions?.payload
    ) {
      renameDocument();
    }
  }, [modal, document.id]);

  useEffect(() => {
    const loadPreview = async () => {
      const file = await stringToMarkdown(props.document.Contents!.content);
      setMarkdownPreview(String(file));
    };

    loadPreview();
  }, [props.document]);

  return (
    <div className="card card-compact rounded-sm bg-base-100 w-56 divide-y-2  shadow-sm border border-slate-300 hover:border-primary hover:cursor-pointer">
      <div style={{ width: "200px", height: "150px", overflow: "hidden" }}>
        <svg viewBox="0 0 800 600" width="200" height="150">
          <foreignObject width="100%" height="100%">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              className="markdown-body !text-3xl p-10"
              dangerouslySetInnerHTML={{ __html: markdownPreview }}
            ></div>
          </foreignObject>
        </svg>
      </div>
      <div className="card-body">
        <h6 className="card-title text-base">{document.title}</h6>
        {children && children}
        {!children && (
          <div className="card-actions justify-between flex-nowrap items-center">
            <i className="fa-regular fa-file-lines text-2xl"></i>
            <span className="text-xs text-slate-500">
              {document.opened_at
                ? `Opened at ${setOpenedDateOrTime(document.opened_at!)}`
                : formatDate(document.created_at!)}
            </span>

            {options && options.length > 0 ? (
              <div className="dropdown relative">
                <button
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle btn-sm btn-ghost m-1"
                  onClick={handleMoreOptions}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul
                  tabIndex={0}
                  className="absolute top-full left-[50%] translate-x-[-50%] dropdown-content menu bg-base-100 z-[1] w-52 p-0 shadow-lg [&_li>*]:rounded-none"
                >
                  {options?.map((option) => (
                    <li
                      key={option.title}
                      onClick={(e: React.MouseEvent) =>
                        handleOptionClick(e, option.title)
                      }
                    >
                      <a>
                        <i className={`fa-solid ${option.icon}`}></i>{" "}
                        {option.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

Card.Actions = function Actions({ children }: { children?: React.ReactNode }) {
  return (
    <div className="card-actions justify-between items-center">{children}</div>
  );
};
