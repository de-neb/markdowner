import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { remark } from "remark";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import html from "remark-html";
import remarkGfm from "remark-gfm";

import {
  postDocument,
  updateDocument,
  getDocumentContentById,
} from "../client/document";

import { RootState } from "../store";
import { navbarActions } from "../store/slices/navbar";
import { MarkdownerDocument } from "../client/type";
import { documentActions } from "../store/slices/document";

export default function Editor() {
  const [parsedValue, setParsedValue] = useState("");
  const [content, setContent] = useState("");
  const [hasHighlightedText, setHasHighlightedText] = useState<boolean | null>(
    false
  );

  const monacoEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const navbarAction = useSelector((state: RootState) => state.navbar.action);
  const user = useSelector((state: RootState) => state.user.user);
  const viewingDocument = useSelector(
    (state: RootState) => state.document.viewingDocument
  );
  const params = useParams();
  const dispatch = useDispatch();

  const handleEditorChange = async (value) => {
    setContent(value);
    const file = await remark().use(html).use(remarkGfm).process(`${value}`);
    setParsedValue(String(file));
  };

  const handleEditorDidMount: OnMount = (editor) => {
    monacoEditorRef.current = editor;
    handleEditorChange(editor.getValue());

    editor.onDidChangeCursorSelection(() => {
      getHighlightedText();
    });
  };

  // when navbar actions are triggered
  const getHighlightedText = (operation?: string) => {
    if (monacoEditorRef.current) {
      const editor = monacoEditorRef.current;
      const selection = editor.getSelection();
      const model = editor.getModel();

      setHasHighlightedText(selection && !selection.isEmpty());

      if (selection && model) {
        const highlightedText = model.getValueInRange(selection);
        const allHighligtedText = model.getFullModelRange();

        switch (operation) {
          case "Cut":
          case "Paste":
            navigator.clipboard.readText().then((text: string) => {
              editor.executeEdits("", [
                {
                  range: selection,
                  text: operation === "Cut" ? "" : text,
                  forceMoveMarkers: true,
                },
              ]);
              editor.pushUndoStop();
            });

            break;
          case "Copy":
            navigator.clipboard.writeText(highlightedText);
            break;
          case "Select All":
            editor.setSelection(allHighligtedText);
            editor.focus();
            break;
          case "Delete":
            editor.setValue("");
            break;
          default:
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (hasHighlightedText) {
      dispatch(navbarActions.setDisabledActions([]));
    } else {
      dispatch(navbarActions.setDisabledActions(["Cut", "Delete"]));
    }
  }, [hasHighlightedText]);

  useEffect(() => {
    switch (navbarAction) {
      case "Save":
        const saveDocument = async () => {
          const document: MarkdownerDocument = {
            ...viewingDocument,
            title: viewingDocument.title,
            owner_id: user.id as string,
          };
          const documentContent = {
            content: content,
            document_id: viewingDocument.id,
          };
          await updateDocument(document, documentContent);
          dispatch(
            documentActions.setViewingDocument({
              ...viewingDocument,
              ...documentContent,
            })
          );
          dispatch(navbarActions.setNavAction(""));
        };

        saveDocument();
        break;
      case "Undo":
        monacoEditorRef.current.trigger(null, "undo", null);
        dispatch(navbarActions.setNavAction(""));
        break;
      case "Redo":
        monacoEditorRef.current.trigger(null, "redo", null);
        dispatch(navbarActions.setNavAction(""));
        break;
      default:
        getHighlightedText(navbarAction);
        dispatch(navbarActions.setNavAction(""));
        break;
    }
  }, [navbarAction, user]);

  // for controling editor and viewer width
  const [isDragging, setIsDragging] = useState(false);
  const [editorWidth, setEditorWidth] = useState("50%");
  const [outputWidth, setOutputWidth] = useState("50%");
  const divider = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const handleOnMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    const parentWidth = container.current!.offsetWidth;

    const leftWidth =
      ((event.clientX - container.current!.offsetLeft) / parentWidth) * 100;
    const rightWidth = 100 - leftWidth;

    if (leftWidth > 10 && leftWidth < 90) {
      setEditorWidth(`${leftWidth}%`);
      setOutputWidth(`${rightWidth}%`);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleEditorValidation = () => {};

  // on mounted
  useEffect(() => {
    const loadDocument = async () => {
      const data = await getDocumentContentById(params.documentId as string);
      handleEditorChange(data.Contents.content);
    };

    loadDocument();
  }, [params]);

  return (
    <div
      ref={container}
      className="flex flex-nowrap min-h-full w-full max-w-screen no-scrollbar"
    >
      <div
        className="card rounded-none bg-base-100  grid min-h-full place-items-center overflow-y-auto overflow-x-hidden"
        style={{ width: editorWidth }}
      >
        <MonacoEditor
          ref={monacoEditorRef}
          height="98%"
          width="100%"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          onValidate={handleEditorValidation}
          value={viewingDocument?.Contents?.content}
          defaultLanguage="markdown"
          defaultValue="# Hello Markdown"
        />
      </div>
      <div
        ref={divider}
        className="bg-slate-300 cursor-ew-resize w-2"
        onMouseDown={handleOnMouseDown}
      ></div>
      <div
        className="markdown-body p-4 card rounded-none bg-base-100 grid h-full overflow-y-auto w-100"
        id="parser-container"
        dangerouslySetInnerHTML={{ __html: parsedValue }}
        style={{ width: outputWidth }}
      ></div>
    </div>
  );
}
