import React from "react";
import cc from "classcat";

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
      className={cc([
        "w-full max-w-4xl  lg:max-w-5xl xl:max-w-6xl mx-auto md:max-w-7xl",
        {
          "py-5": topAndBottom,
          "px-4": leftAndRight,
        },
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
