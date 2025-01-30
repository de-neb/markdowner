type ButtonProps = {
  title?: string | null;
  icon?: string | null;
  variant?: "ghost" | "circle" | "link" | "primary" | "secondary" | "accent";
  size?: "xs" | "sm" | "md" | "lg";
  hasTextAndIcon?: boolean;
  iconSize?: string;
  tooltipName?: string;
  tooltipLoc?: "bottom" | "right" | "left" | "top";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  title,
  icon,
  variant = "ghost",
  size = "md",
  className,
  hasTextAndIcon = false,
  iconSize = "2xl",
  tooltipName,
  tooltipLoc,
  ...props
}: ButtonProps) {
  return (
    <div
      className={icon ? `tooltip tooltip-${tooltipLoc} ml-auto` : ""}
      data-tip={icon ? tooltipName : undefined}
    >
      <button
        className={`btn transition duration-300  hover:shadow-[5px_5px_0] btn-${variant} btn-${size} ${className}`}
        {...props}
      >
        {icon && <i className={`fa-solid fa-${icon} text-${iconSize}`}></i>}
        {(!icon || hasTextAndIcon) && title}
      </button>
    </div>
  );
}
