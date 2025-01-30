import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { remark } from "remark";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import html from "remark-html";
import remarkGfm from "remark-gfm";

import { updateDocument, getDocumentContentById } from "../client/document";

import { RootState } from "../store";
import { navbarActions } from "../store/slices/navbar";
import { MarkdownerDocument } from "../client/type";
import { documentActions } from "../store/slices/document";
import {
  debounce,
  downloadMarkdownFile,
  generateMarkdownTable,
  getUserColor,
} from "../utils/misc";
import { MARKDOWN_SYNTAX } from "../constants/Editor";
import { trackCursorPosition } from "../client/cursor";

export default function Editor() {
  const [parsedValue, setParsedValue] = useState("");
  const [content, setContent] = useState("");
  const [hasHighlightedText, setHasHighlightedText] = useState<boolean | null>(
    false
  );

  const previousDeltaDecorations = useRef<string[]>();
  const monacoEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoInstance = useRef();
  const navbarAction = useSelector((state: RootState) => state.navbar.action);
  const tableSize = useSelector((state: RootState) => state.navbar.tableSize);
  const user = useSelector((state: RootState) => state.user.user);
  const viewingDocument = useSelector(
    (state: RootState) => state.document.viewingDocument
  );
  const params = useParams();
  const dispatch = useDispatch();

  const debouncedSetContent = debounce((newContent: string) => {
    if (content !== newContent) {
      dispatch(documentActions.setDocumentContent(newContent));
    }
  }, 500);

  // get cursor position
  const trackAndUpdateCursorPosition = async () => {
    if (!monacoEditorRef.current) {
      return;
    }

    const position = monacoEditorRef.current.getPosition();

    const data = {
      document_id: viewingDocument.id as string,
      cursor_position: position,
      typing_state: true,
      user_id: user.id as string,
      document_content: content || viewingDocument.content,
      date: new Date(),
    };

    const cursorChannel = await trackCursorPosition(data);

    cursorChannel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const state = cursorChannel.presenceState();

        const latestState = Object.values(state).flatMap((userState: any) =>
          userState.filter((item: typeof data) => item.cursor_position)
        );

        const { document_content } = latestState.reduce((prev, curr) =>
          new Date(prev.date) > new Date(curr.date) ? prev : curr
        );

        debouncedSetContent(document_content);

        const selections = Object.values(state).flatMap((userState) =>
          userState
            .filter((item: any) => item.cursor_position)
            .map((item: any) => {
              const userColorClass = getUserColor(item.user_id);
              return {
                range: new monacoInstance.current.Range(
                  item.cursor_position.lineNumber,
                  item.cursor_position.column,
                  item.cursor_position.lineNumber,
                  item.cursor_position.column
                ),
                options: {
                  className: `absolute border-l-2 ${userColorClass}`,
                  isWholeLine: false,
                },
              };
            })
        );

        previousDeltaDecorations.current =
          monacoEditorRef.current?.deltaDecorations(
            previousDeltaDecorations.current || [],
            selections
          );
      }
    );
  };

  const handleEditorChange = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    setContent(value);
    const file = await remark().use(html).use(remarkGfm).process(`${value}`);
    setParsedValue(String(file));
    trackAndUpdateCursorPosition();
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monacoEditorRef.current = editor;
    monacoInstance.current = monaco;
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

  const insertTextAtCursor = (text: string) => {
    if (monacoEditorRef.current) {
      const editor = monacoEditorRef.current;
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits("", [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: text,
            forceMoveMarkers: true,
          },
        ]);
        editor.pushUndoStop();
      }
    }
  };

  useEffect(() => {
    if (hasHighlightedText) {
      dispatch(navbarActions.setDisabledActions([]));
    } else {
      dispatch(navbarActions.setDisabledActions(["Cut", "Delete"]));
    }
  }, [hasHighlightedText, dispatch]);

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
            document_id: viewingDocument.id!,
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
        monacoEditorRef.current?.trigger(null, "undo", null);
        break;
      case "Redo":
        monacoEditorRef.current?.trigger(null, "redo", null);
        break;
      case "Custom Table":
        const markdownTableText = generateMarkdownTable(tableSize);
        insertTextAtCursor(markdownTableText);
        break;
      case "Download":
        downloadMarkdownFile(
          viewingDocument.title,
          viewingDocument.content as string
        );
        break;
      default:
        if (Object.keys(MARKDOWN_SYNTAX).includes(navbarAction)) {
          insertTextAtCursor(
            MARKDOWN_SYNTAX[navbarAction as keyof typeof MARKDOWN_SYNTAX]
          );
        }
        getHighlightedText(navbarAction);
        break;
    }
    dispatch(navbarActions.setNavAction(""));
  }, [navbarAction, user, tableSize, content, dispatch, viewingDocument]);

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
  }, [isDragging, handleMouseMove]);

  const handleEditorValidation = () => {};

  // on mounted load document and track cursor position
  useEffect(() => {
    const loadDocument = async () => {
      const data = await getDocumentContentById(params.documentId as string);
      if (data) {
        handleEditorChange(data?.content || "");
      }
    };
    loadDocument();
  }, [params, handleEditorChange]);

  return (
    <div
      ref={container}
      className="flex flex-nowrap min-h-full w-full max-w-screen no-scrollbar"
    >
      <MonacoEditor
        ref={monacoEditorRef}
        height="100vh"
        width={editorWidth}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        onValidate={handleEditorValidation}
        value={viewingDocument.content}
        defaultLanguage="markdown"
        defaultValue="# Hello Markdown"
        className="min-h-full"
      />

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
