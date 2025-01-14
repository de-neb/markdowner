import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navbarActions } from "../store/slices/navbar";
import { RootState } from "../store";

export default function Tiles() {
  const gridSize = 10;
  const gridItems = Array.from({ length: gridSize * gridSize });
  const [hoveredSize, setHoveredSize] = useState({ rows: 0, cols: 0 });
  const tableSize = useSelector((state: RootState) => state.navbar.tableSize);

  const dispatch = useDispatch();

  const handleOnGridClick = () => {
    dispatch(navbarActions.setTableSize(hoveredSize));
  };

  return (
    <div className="p-4 w-full h-auto flex flex-col items-center">
      <div
        className={`grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(10,1fr)] gap-0`}
      >
        {gridItems.map((_, index) => {
          const row = Math.floor(index / gridSize) + 1;
          const col = (index % gridSize) + 1;

          const isHighlighted =
            row <= hoveredSize.rows && col <= hoveredSize.cols;

          return (
            <div
              key={index}
              className={`w-5 h-5 border ${
                isHighlighted ? "border-primary" : "border-slate-200"
              }`}
              onMouseEnter={() => setHoveredSize({ rows: row, cols: col })}
              onClick={handleOnGridClick}
            ></div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 font-semibold">
        {hoveredSize.rows > 0 && hoveredSize.cols > 0
          ? `Insert ${hoveredSize.rows} x ${hoveredSize.cols} Table`
          : "Hover over the grid to select table size"}
      </p>
    </div>
  );
}
