type ButtonProps = {
  title?: string | null;
  icon?: string | null;
  variant?: "ghost" | "circle" | "link" | "primary" | "secondary" | "accent";
  size?: "xs" | "sm" | "md" | "lg";
  hasTextAndIcon?: boolean;
  iconSize?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  title,
  icon,
  variant = "ghost",
  size = "md",
  color = "primary",
  className,
  hasTextAndIcon = false,
  iconSize = "2xl",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ml-auto btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {icon && <i className={`fa-solid fa-${icon} text-${iconSize}`}></i>}
      {(!icon || hasTextAndIcon) && title}
    </button>
  );
}
