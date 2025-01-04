import { fireEvent, render, screen } from "@testing-library/react";
// import LoginSignup from "../pages/LoginSignup";
import { Provider } from "react-redux";
import { store } from "../state/index";

describe("Login and Signup forms test", () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // container = render(
    //   <Provider store={store}>
    //     <LoginSignup />
    //   </Provider>
    // ).container;
  });

  it("Renders Login form correctly", () => {
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(2);
    expect(inputs[0].id).toBe("email");
    expect(inputs[1].id).toBe("password");
    expect(screen.getByTestId("set-signup-screen")).toBeInTheDocument();
    expect(screen.getByTestId("button-sigin")).toBeInTheDocument();
  });

  it("renders Signup form correctly", () => {
    const setSignupButton = screen.getByTestId("set-signup-screen");
    fireEvent.click(setSignupButton);
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].id).toBe("email");
    expect(inputs[1].id).toBe("username");
    expect(inputs[2].id).toBe("password");
    expect(screen.getByTestId("set-signin-screen")).toBeInTheDocument();
    expect(screen.getByTestId("button-signup")).toBeInTheDocument();
  });

  it("Switches between login and signup screens", () => {
    const setSignupButton = screen.getByTestId("set-signup-screen");
    fireEvent.click(setSignupButton);
    const setLoginButton = screen.getByTestId("set-signin-screen");
    expect(setLoginButton).toBeInTheDocument();
    fireEvent.click(setLoginButton);
    expect(setSignupButton).toBeInTheDocument();
  });
});
