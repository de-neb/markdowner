import { useState } from "react";
import Tiles from "./Tiles";

type DropdownItem =
  | { title: string; icon?: string; subItems?: string[] }[]
  | string[];

type DropdownProps = {
  title?: string;
  activatorClass?: string;
  menuClass?: string;
  dropdownClass?: string;
  icon?: string;
  menuItemClick: (item: string) => void;
  subMenuItemClick?: (item: string) => void;
  activatorClick?: () => void;
  disabledActions?: string[];
} & (
  | { items: DropdownItem; children?: never }
  | { items?: never; children: React.ReactNode }
);

export default function Dropdown({
  title,
  items,
  activatorClass = "",
  icon,
  menuClass = "",
  dropdownClass = "",
  menuItemClick,
  subMenuItemClick,
  activatorClick,
  disabledActions = [],
  children,
}: DropdownProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const customActivatorButtonClass = `btn btn-ghost hover:shadow-[5px_5px_0] m-1 ${
    icon ? "btn-circle" : ""
  } ${activatorClass}`;

  const handleItemClick = (itemTitle: string) => {
    if (!disabledActions.includes(itemTitle)) menuItemClick(itemTitle);
  };

  const handleSubItemClick = (subItem: string) => {
    subMenuItemClick?.(subItem);
  };

  return (
    <div className={`dropdown dropdown-bottom   relative ${dropdownClass}`}>
      <div
        tabIndex={0}
        role="button"
        className={customActivatorButtonClass}
        onClick={activatorClick}
      >
        {icon && <i className={`fa-solid fa-${icon}`}></i>}
        {!icon && title}
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 shadow  z-[1] w-52 p-0  [&_li>*]:rounded-none ${menuClass}`}
      >
        {children && children}
        {items &&
          items.map((item, index) => {
            if (typeof item === "object" && item.subItems) {
              return (
                <li
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveItemIndex(index)}
                  onMouseLeave={() => setActiveItemIndex(null)}
                >
                  <a role="button" tabIndex={index}>
                    {item.icon && (
                      <i className={`fa-solid fa-${item.icon}`}></i>
                    )}
                    {item.title}
                    {item.subItems && (
                      <i className="ml-auto fa-solid fa-caret-right"></i>
                    )}
                  </a>
                  {activeItemIndex === index && (
                    <ul className="absolute left-[12rem] top-0 menu bg-base-100 z-[2] w-52 p-0 shadow [&_li>*]:rounded-none">
                      {item.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          onClick={() => handleSubItemClick(subItem)}
                        >
                          {item.title === "Tables" ? (
                            <Tiles />
                          ) : (
                            <a>{subItem}</a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li
                key={typeof item === "string" ? item : item.title}
                className="flex flex-nowrap"
                onClick={() =>
                  typeof item === "string"
                    ? handleItemClick(item)
                    : handleItemClick(item.title)
                }
              >
                <a
                  className={
                    disabledActions.includes(typeof item === "string" ? item : item.title)
                      ? "pointer-events-none text-slate-400"
                      : ""
                  }
                >
                  {typeof item !== "string" && item.icon && (
                    <i className={`fa-solid fa-${item.icon}`}></i>
                  )}
                  {typeof item === "string" ? item : item.title}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
