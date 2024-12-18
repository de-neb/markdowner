import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { SORT_ITEMS } from "../constants/Home";
import { getDocuments } from "../client/editor";
import { documentActions } from "../store/slices/document";

import Card from "../components/Card";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { RootState } from "../store";
import { MarkdownerDocument } from "../client/type";

export default function Home() {
  const [listView, setListView] = useState("border-all");
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.document.documents);
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadDocuments = async () => {
      const data = await getDocuments();
      dispatch(documentActions.setDocuments(data));
    };

    loadDocuments();
  }, []);

  return (
    <div className="flex justify-items-center flex-col my-10 mx-auto w-5/6 h-auto">
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
                    title={document.title}
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
  );
}
