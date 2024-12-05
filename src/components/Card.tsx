type CardProps = {
  src: string;
  title: string;
  children?: React.ReactNode;
};

export default function Card({ src, title, children }: CardProps) {
  return (
    <div className="card card-compact rounded-sm bg-base-100 w-56  shadow-sm border border-slate-300 hover:border-primary hover:cursor-pointer">
      <figure>
        <img src={src} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h6 className="card-title text-base">{title}</h6>
        {children && children}
        {!children && (
          <div className="card-actions justify-between items-center">
            <span>{Date.now()}</span>

            <div className="dropdown relative">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-sm btn-ghost m-1"
              >
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </div>
              <ul
                tabIndex={0}
                className="absolute top-full left-[50%] translate-x-[-50%] dropdown-content menu bg-base-100 z-[1] w-52 p-0 shadow-lg [&_li>*]:rounded-none"
              >
                <li>
                  <a>
                    <i className="fa-solid fa-t"></i> Rename
                  </a>
                </li>
                <li>
                  <a>
                    <i className="fa-solid fa-trash-can"></i> Remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Card.Actions = function Actions({ children }: { children?: React.ReactNode }) {
  return (
    <div className="card-actions justify-between items-center">{children}</div>
  );
};
