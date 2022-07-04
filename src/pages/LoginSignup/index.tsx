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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <InputField
          id="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField
          value={password}
          id="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </div>
      <Button $fluid>Login</Button>
    </form>
  );
};

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

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
        <InputField
          id="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <InputField
          id="username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField
          value={password}
          id="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </div>
      <Button $fluid>Continue</Button>
    </form>
  );
};

export default withContainer(LoginSignup, { containerClass: "m-auto" });
