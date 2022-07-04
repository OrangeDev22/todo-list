import { FC } from "react";
import Container from "../Components/Container";

type Options = {
  leftAndRight?: boolean;
  topAndBottom?: boolean;
  containerClass?: string;
};

function withContainer<Props = unknown>(Component: FC, opts?: Options) {
  return (props: Props) => {
    return (
      <Container
        leftAndRight={opts?.leftAndRight || false}
        topAndBottom={opts?.topAndBottom}
        className={opts?.containerClass}
      >
        <Component {...props} />
      </Container>
    );
  };
}

export default withContainer;
