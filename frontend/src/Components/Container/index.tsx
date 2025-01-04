import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  topAndBottom?: boolean;
  leftAndRight?: boolean;
  className?: string;
};

const Container = ({
  children,
  topAndBottom,
  leftAndRight,
  className,
}: Props) => {
  return (
    <div
      className={twMerge([
        "w-full max-w-4xl  lg:max-w-5xl xl:max-w-6xl mx-auto md:max-w-7xl",
        topAndBottom && "py-5",
        leftAndRight && "px-4",
        className,
      ])}
    >
      {children}
    </div>
  );
};

Container.defaultProps = {
  leftAndRight: true,
};

export default Container;
