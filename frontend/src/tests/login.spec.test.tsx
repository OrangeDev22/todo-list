import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import SiginForm from "../Components/SiginForm";
import { store } from "../state";
import { TextEncoder, TextDecoder } from "util";
import SiginPage from "../pages/SiginPage";
import { BrowserRouter } from "react-router-dom";
import { json } from "stream/consumers";

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
          <SiginForm />
        </BrowserRouter>
      </Provider>
    ).container;
  });

  it("Renders Login form correctly", () => {
    const inputs = container.querySelectorAll("input");
    const labels = container.querySelectorAll("label");

    expect(inputs).toHaveLength(2);
    expect(labels).toHaveLength(2);

    expect(labels[0].getAttribute("for")).toBe("email");
    expect(labels[1].getAttribute("for")).toBe("password");

    const emailInput = screen.getByTestId("input-email");
    const passwordInput = screen.getByTestId("input-password");

    expect(emailInput.getAttribute("name")).toBe("email");
    expect(passwordInput.getAttribute("name")).toBe("password");

    expect(screen.getByTestId("set-signup-screen")).toBeInTheDocument();

    const signupUrl = screen.getByTestId("set-signup-screen");

    expect(signupUrl).toBeInTheDocument();
    expect(signupUrl).toHaveTextContent("Need an account? Register Here");

    const loginButton = screen.getByTestId("button-sigin");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Login");
  });
});
