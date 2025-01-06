import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { HOME_CARD_OPTIONS, SORT_ITEMS } from "../constants/Home";
import { getDocuments, postDocument } from "../client/document";
import { documentActions } from "../store/slices/document";

import Card from "../components/Card";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { RootState } from "../store";
import { MarkdownerDocument } from "../client/type";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listView, setListView] = useState("border-all");
  const documents = useSelector((state: RootState) => state.document.documents);
  const user = useSelector((state: RootState) => state.user.user);
  const modal = useSelector((state: RootState) => state.modal);

  const isGridView = listView === "border-all";

  const toggleListView = () => {
    setListView((prevListView) =>
      prevListView === "border-all" ? "list" : "border-all"
    );
  };

  const handleMenuItemClick = (title: string) => {
    console.log("title", title);
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
    if (document) {
      dispatch(documentActions.setViewingDocument(newDocument));
      navigate(`/editor/${document.id}`);
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      const data = await getDocuments();
      dispatch(documentActions.setDocuments(data));
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      const data = await getDocuments();
      dispatch(documentActions.setDocuments(data));
    };

    loadDocuments();
  }, [modal.isConfirmed]);

  return (
    <>
      <div className="flex h-max justify-items-center flex-col my-10 mx-auto w-5/6">
        <div className="flex-grow flex justify-between items-center gap-1">
          <h2 className="font-semibold">Recent Documents</h2>

          <Button icon={listView} onClick={toggleListView} />

          <Dropdown
            icon="sort"
            items={SORT_ITEMS}
            menuItemClick={handleMenuItemClick}
          />
        </div>

        {isGridView && (
          <div className="flex-grow flex flex-wrap gap-2">
            {documents.length
              ? documents.map((document) => (
                  <div
                    onClick={() => handleCardClick(document)}
                    key={document.id}
                  >
                    <Card
                      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                      document={document}
                      options={HOME_CARD_OPTIONS}
                    ></Card>
                  </div>
                ))
              : "No documents found."}
          </div>
        )}

        {
          /* {!isGridView} */
          // todo list view
        }
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
