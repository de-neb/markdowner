import { RootState } from "../store";
import { useSelector } from "react-redux";

export default function Loader() {
  const loading = useSelector((state: RootState) => state.loader.loading);
  const loadingText = useSelector(
    (state: RootState) => state.loader.loadingText
  );

  return (
    <>
      {loading ? (
        <div className="absolute top-0 left-0 right-0 flex flex-col justify-center items-center backdrop-blur-md h-screen w-100 bg-white/30 z-[10000]">
          <h2 className="text-2xl">{loadingText}</h2>
          <progress className="progress w-56 rounded-sm"></progress>
        </div>
      ) : null}
    </>
  );
}
