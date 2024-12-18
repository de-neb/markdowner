import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { remark } from "remark";
import { postDocument } from "../client/editor";
import { useDispatch } from "react-redux";
import MonacoEditor from "@monaco-editor/react";
import html from "remark-html";
import remarkGfm from "remark-gfm";

import "github-markdown-css/github-markdown.css";
import { RootState } from "../store";
import { navbarActions } from "../store/slices/navbar";
import { MarkdownerDocument } from "../client/type";

export default function Editor() {
  const [parsedValue, setParsedValue] = useState("");
  const navbarAction = useSelector((state: RootState) => state.navbar.action);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const handleEditorChange = async (value) => {
    const file = await remark().use(html).use(remarkGfm).process(`${value}`);
    setParsedValue(String(file));
  };

  function handleEditorDidMount(editor) {
    editor.current = editor;
    handleEditorChange(editor.getValue());
  }

  function handleEditorValidation(markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

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

  //
  useEffect(() => {
    if (navbarAction === "Save") {
      const saveDocument = async () => {
        const document: MarkdownerDocument = {
          title: "test",
          owner_id: user.id as string,
        };
        await postDocument(document);
        dispatch(navbarActions.setNavAction(""));
      };

      saveDocument();
    }
  }, [navbarAction, user]);

  return (
    <div
      ref={container}
      className="flex flex-nowrap h-full w-full max-w-screen no-scrollbar"
    >
      <div
        className="card rounded-none bg-base-100  grid h-full place-items-center overflow-y-auto overflow-x-hidden"
        style={{ width: editorWidth }}
      >
        <MonacoEditor
          height="98%"
          width="100%"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          onValidate={handleEditorValidation}
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
