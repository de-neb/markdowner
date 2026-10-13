import { RootState } from "../store";
import { useSelector } from "react-redux";

export default function Loader() {
  const loading = useSelector((state: RootState) => state.loader.loading);
  const loadingText = useSelector(
    (state: RootState) => state.loader.loadingText,
  );

  return (
    <>
      {loading ? (
        <div
          className="loader-backdrop"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="loader-panel">
            <span className="loader-spinner" aria-hidden="true" />
            <h2 className="loader-text">{loadingText}</h2>
            <progress className="progress progress-primary w-64 rounded-full"></progress>
          </div>
        </div>
      ) : null}
    </>
  );
}
