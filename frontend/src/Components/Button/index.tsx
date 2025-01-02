import cc from "classcat";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: any;
  size: "sm" | "md";
  $fluid?: boolean;
  $inverted?: boolean;
} & (
  | ({
      to: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ButtonHTMLAttributes<HTMLButtonElement>
);

const Button = ({ size, $fluid, $inverted, ...props }: Props) => {
  const className = cc([
    "rounded-md text-center bg-indigo-500 text-white active:bg-opacity-90",
    {
      "px-3 py-2 text-md": size === "md",
      "px-2 py-1 text-sm h-10": size === "sm",
      "w-full": $fluid,
    },
    props.className,
  ]);

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
