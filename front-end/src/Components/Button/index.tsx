import cc from "classcat";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: any;
  $size: "sm" | "md";
  $fluid?: boolean;
  $inverted?: boolean;
} & (
  | ({
      to: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ButtonHTMLAttributes<HTMLButtonElement>
);

const Button = ({ $size, $fluid, $inverted, ...props }: Props) => {
  const className = cc([
    "inline-block rounded-sm text-center bg-cyan-500 text-white active:bg-opacity-90",
    {
      // $size
      "px-3 py-2 text-md": $size === "md",
      "px-2 py-2 text-sm": $size === "sm",
      // $fluid
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
  $type: "primary",
  $size: "md",
};

export default Button;
