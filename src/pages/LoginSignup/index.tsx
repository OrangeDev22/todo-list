import React, { useState } from "react";
import Button from "../../Components/Button";
import Container from "../../Components/Container";
import InputField from "../../Components/InputField";
import withContainer from "../../hoc/withContainer";

function LoginSignup() {
  const [screen, setScreen] = useState<"login" | "signup">("login");
  return (
    <Container>
      <div>
        {screen === "login" ? <LoginForm /> : <SignupForm />}{" "}
        {screen === "login" ? (
          <div className="my-2">
            Need an account?{" "}
            <span
              className="text-cyan-500 cursor-pointer"
              onClick={() => setScreen("signup")}
            >
              Register
            </span>
          </div>
        ) : (
          <div className="my-2">
            Have an account?{" "}
            <span
              className="text-cyan-500 cursor-pointer"
              onClick={() => setScreen("login")}
            >
              Login Here
            </span>
          </div>
        )}
      </div>
    </Container>
  );
}

const LoginForm = () => {
  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-7"
    >
      <div>
        <label htmlFor="email">Email</label>
        <InputField id="email" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField id="password" />
      </div>
      <Button $fluid>Login</Button>
    </form>
  );
};

const SignupForm = () => {
  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-7"
    >
      <div>
        <label htmlFor="email">Email</label>
        <InputField id="email" />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <InputField id="username" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField id="password" />
      </div>
      <Button $fluid>Continue</Button>
    </form>
  );
};

export default withContainer(LoginSignup, { containerClass: "m-auto" });
