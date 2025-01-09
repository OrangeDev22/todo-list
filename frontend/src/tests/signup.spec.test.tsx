import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import SignupForm from "../Components/SignupForm";
import { store } from "../state";
import { TextEncoder } from "util";
import { BrowserRouter } from "react-router-dom";

global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

describe("Login and Signup forms test", () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    container = render(
      <Provider store={store}>
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      </Provider>
    ).container;
  });

  it("Renders Login form correctly", () => {
    const inputs = container.querySelectorAll("input");
    const labels = container.querySelectorAll("label");

    expect(inputs).toHaveLength(3);
    expect(labels).toHaveLength(3);

    expect(labels[0].getAttribute("for")).toBe("email");
    expect(labels[1].getAttribute("for")).toBe("username");
    expect(labels[2].getAttribute("for")).toBe("password");

    const emailInput = screen.getByTestId("input-email");
    const passwordInput = screen.getByTestId("input-password");
    const userNameInput = screen.getByTestId("input-username");

    expect(emailInput.getAttribute("name")).toBe("email");
    expect(passwordInput.getAttribute("name")).toBe("password");
    expect(userNameInput.getAttribute("name")).toBe("username");

    const signupIn = screen.getByTestId("set-signin-screen");

    expect(signupIn).toBeInTheDocument();

    expect(signupIn).toBeInTheDocument();
    expect(signupIn).toHaveTextContent("Have an account? Sigin Here");

    const signupButton = screen.getByTestId("button-signup");
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveTextContent("Continue");
  });
});
