import { useState } from "react";

type DropdownProps = {
  title?: string;
  items:
    | Array<{ title: string; icon?: string; subItems?: string[] }>
    | string[];
  activatorClass?: string;
  menuClass?: string;
  icon?: string;
  menuItemClick: (item: string) => void;
  subMenuItemClick?: (item: string) => void;
  disabledActions?: string[];
};

export default function Dropdown({
  title,
  items,
  activatorClass,
  icon,
  menuClass,
  menuItemClick,
  subMenuItemClick,
  disabledActions,
}: DropdownProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const customActivatorButtonClass = `btn btn-ghost m-1 ${
    icon ? "btn-circle" : null
  } ${activatorClass}`;

  const handleMouseEnter = (index: number) => {
    setActiveItemIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveItemIndex(null);
  };

  const isDisabled = (action: string) => {
    return disabledActions?.includes(action);
  };

  const handleSubItemClick = (e: any, title: string) => {
    // e.stopPropagation();
    if (subMenuItemClick) {
      subMenuItemClick(title);
    }
  };

  return (
    <div className="dropdown dropdown-bottom relative">
      <div tabIndex={0} role="button" className={customActivatorButtonClass}>
        {icon && <i className={`fa-solid fa-${icon}`}></i>}
        {!icon && title}
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 z-[1] w-52 p-0 shadow [&_li>*]:rounded-none ${menuClass}`}
      >
        {items.map((item, index) => {
          if (typeof item === "object" && item.subItems) {
            return (
              <li
                key={item.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <a role="button" tabIndex={index}>
                  {item.icon && <i className={`fa-solid fa-${item.icon}`}></i>}
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
                        onClick={() => subMenuItemClick(subItem)}
                      >
                        <a>{subItem}</a>
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
              onClick={
                isDisabled(item.title)
                  ? null
                  : () => menuItemClick(item.title as string)
              }
            >
              <a
                className={
                  isDisabled(item.title)
                    ? "pointer-events-none text-slate-400"
                    : ""
                }
              >
                {item.icon && <i className={`fa-solid fa-${item.icon}`}></i>}
                {typeof item === "string" ? item : item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
