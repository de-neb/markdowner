import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { HOME_CARD_OPTIONS, SORT_ITEMS } from "../constants/Home";
import { getDocuments, postDocument } from "../client/document";
import { postCollaborator } from "../client/collaboration";
import { documentActions } from "../store/slices/document";

import HomeDocument from "../components/HomeDocument";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { RootState } from "../store";
import { MarkdownerDocument } from "../client/type";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listView, setListView] = useState("list");
  const documents = useSelector((state: RootState) => state.document.documents);
  const isSearching = useSelector(
    (state: RootState) => state.document.isSearching
  );
  const user = useSelector((state: RootState) => state.user.user);
  const modal = useSelector((state: RootState) => state.modal);

  const isGridView = listView === "border-all";

  const toggleListView = () => {
    setListView((prevListView) =>
      prevListView === "border-all" ? "list" : "border-all"
    );
  };

  const handleMenuItemClick = async (title: string) => {
    let key = "";
    switch (title) {
      case "Last modified":
        key = "updated_at";
        break;
      case "Last opened":
        key = "opened_at";
        break;
      case "Title":
        key = "title";
        break;
      default:
        break;
    }
    await getDocuments(key as keyof MarkdownerDocument);
  };

  const handleCardClick = (document: MarkdownerDocument) => {
    dispatch(documentActions.setViewingDocument(document));
    navigate(`/editor/${document.id}`);
  };

  const handleCreateNewDocument = async () => {
    const newDocument = {
      title: "Untitled",
      owner_id: user.id as string,
    };
    const document = await postDocument(newDocument);

    await postCollaborator(user.email as string, document.id);
    if (document) {
      dispatch(documentActions.setViewingDocument(newDocument));
      navigate(`/editor/${document.id}`);
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      await getDocuments();
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    if (modal.isConfirmed) {
      const loadDocuments = async () => {
        await getDocuments();
      };

      loadDocuments();
    }
  }, [modal.isConfirmed]);

  return (
    <>
      <div className="flex h-max justify-items-center flex-col my-10 mx-auto w-5/6">
        <div className="flex-grow flex justify-between items-center gap-1">
          <h2 className="font-semibold">
            {isSearching ? "Results" : "Documents"}
          </h2>

          <Button
            icon={listView}
            onClick={toggleListView}
            className="btn-circle"
          />

          <Dropdown
            icon="sort"
            items={SORT_ITEMS}
            menuItemClick={handleMenuItemClick}
          />
        </div>

        <div
          className={`flex-grow flex flex-wrap ${
            !isGridView ? "gap-2" : undefined
          }`}
        >
          {documents.length ? (
            documents.map((document, i) => (
              <div
                onClick={() => handleCardClick(document)}
                key={document.id}
                className={isGridView ? "w-full" : undefined}
              >
                <HomeDocument
                  document={document}
                  options={HOME_CARD_OPTIONS}
                  isCardView={!isGridView}
                ></HomeDocument>

                {i >= 0 && i < documents.length - 1 && isGridView && (
                  <div className="divider m-0"></div>
                )}
              </div>
            ))
          ) : (
            <span className="text-md mx-auto">
              No documents have been created yet.
            </span>
          )}
        </div>
      </div>
      <div className="flex absolute bottom-5 right-10">
        <div className="tooltip tooltip-left" data-tip="Create new document">
          <Button
            icon="plus"
            variant="circle"
            size="lg"
            onClick={handleCreateNewDocument}
          />
        </div>
      </div>
    </>
  );
}
