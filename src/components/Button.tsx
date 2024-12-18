type ButtonProps = {
  title?: string;
  icon?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ title, icon, ...props }: ButtonProps) {
  return (
    <button className="btn btn-ghost btn-circle ml-auto" {...props}>
      {icon && <i className={`fa-solid fa-${icon}`}></i>}
      {!icon && title}
    </button>
  );
}
