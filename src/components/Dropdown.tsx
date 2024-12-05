import { useState } from "react";

type DropdownProps = {
  title: string;
  items: Array<{ title: string; subItems?: string[] } | string>;
};

export default function Dropdown({ title, items }: DropdownProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveItemIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveItemIndex(null);
  };

  return (
    <div className="dropdown dropdown-bottom">
      <div tabIndex={0} role="button" className="btn m-1 btn-sm btn-ghost">
        {title}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 z-[1] w-52 p-0 shadow [&_li>*]:rounded-none"
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
                  {item.title}
                  {item.subItems && (
                    <i className="ml-auto fa-solid fa-caret-right"></i>
                  )}
                </a>
                {activeItemIndex === index && (
                  <ul className="absolute left-[12rem] top-0 menu bg-base-100 z-[2] w-52 p-0 shadow [&_li>*]:rounded-none">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a>{subItem}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          return (
            <li key={typeof item === "string" ? item : item.title}>
              <a>{typeof item === "string" ? item : item.title}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
