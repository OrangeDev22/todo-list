import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type Props = {
  children: any;
  size: "sm" | "md";
  fulLWidth?: boolean;
} & (
  | ({
      to: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ButtonHTMLAttributes<HTMLButtonElement>
);

const Button = ({ size, fulLWidth, ...props }: Props) => {
  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const className = twMerge(
    "rounded-md text-center bg-indigo-500 text-white active:bg-opacity-90",
    sizeStyles[size],
    fulLWidth ? "w-full" : null,
    props.className
  );
  if ("to" in props) {
    return <Link {...props} className={className} />;
  } else {
    return <button {...props} className={className} />;
  }
};

Button.defaultProps = {
  size: "md",
};

export default Button;
