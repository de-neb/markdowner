type ButtonProps = {
  title?: string | null;
  icon?: string | null;
  variant?: "ghost" | "circle" | "link" | "primary" | "secondary" | "accent";
  size?: "xs" | "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  title,
  icon,
  variant = "ghost",
  size = "md",
  color = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={`btn ml-auto btn-${variant} btn-${size}`} {...props}>
      {icon && <i className={`fa-solid fa-${icon} text-2xl`}></i>}
      {!icon && title}
    </button>
  );
}
