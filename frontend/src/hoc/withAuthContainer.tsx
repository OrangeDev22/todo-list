import { FC } from "react";
import Container from "../Components/Container/index";

type Options = {
  leftAndRight?: boolean;
  topAndBottom?: boolean;
  containerClass?: string;
};

function withAuthContainer<Props = unknown>(Component: FC, opts?: Options) {
  return (props: Props) => {
    return (
      <Container
        leftAndRight={opts?.leftAndRight || false}
        topAndBottom={opts?.topAndBottom}
        className="w-full p-4 !max-w-3xl m-auto"
      >
        <Component {...props} />
      </Container>
    );
  };
}

export default withAuthContainer;
