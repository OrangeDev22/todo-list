import axios from "../../axios";
import React, { useState } from "react";
import Button from "../../Components/Button";
import Container from "../../Components/Container";
import InputField from "../../Components/InputField";
import withContainer from "../../hoc/withContainer";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state";
import { useDispatch } from "react-redux";

function LoginSignup() {
  const [screen, setScreen] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Container>
      <div>
        {screen === "login" ? (
          <LoginForm submitting={submitting} setSubmitting={setSubmitting} />
        ) : (
          <SignupForm
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSignupComplete={() => {
              setScreen("login");
            }}
          />
        )}{" "}
        {screen === "login" ? (
          <div className="my-2">
            Need an account?{" "}
            <span
              className="text-cyan-500 cursor-pointer"
              onClick={() => setScreen("signup")}
              data-testid="set-signup-screen"
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
              data-testid="set-signin-screen"
            >
              Login Here
            </span>
          </div>
        )}
      </div>
    </Container>
  );
}

type CommmonTypes = {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ submitting, setSubmitting }: CommmonTypes) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = bindActionCreators(actionCreators, dispatch);
  const [responseError, setResponseError] = useState("");

  return (
    <form
      action=""
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await axios
          .post("/auth/signin", {
            email,
            password,
          })
          .then((response) => {
            const { id, email, username, token } = response.data;
            setUser({ id, email, username, token });
            setResponseError("");
          })
          .catch((e) => {
            setResponseError(e.response.data.message);
            setSubmitting(false);
          });
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
          required
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField
          value={password}
          id="password"
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>
      {responseError && <div className="text-red-600">{responseError}</div>}

      <Button $fluid data-testid="button-sigin">
        {submitting ? "Loading..." : "Login"}
      </Button>
    </form>
  );
};

const SignupForm = ({
  submitting,
  setSubmitting,
  onSignupComplete,
}: CommmonTypes & { onSignupComplete: () => void }) => {
  const dispatch = useDispatch();
  const [responseError, setResponseError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setUser } = bindActionCreators(actionCreators, dispatch);

  return (
    <form
      action=""
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await axios
          .post("/auth/signup", {
            email,
            password,
            username,
          })
          .then((response) => {
            const { id, email, username, token } = response.data;
            setUser({ id, email, username, token });
            onSignupComplete();
          })
          .catch((e) => {
            setSubmitting(false);
            setResponseError(e.response.data.message);
          });
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
          required
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
          required
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField
          value={password}
          id="password"
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>
      {responseError && <div className="text-red-600">{responseError}</div>}
      <Button $fluid data-testid="button-signup">
        {submitting ? "Loading..." : "Continue"}
      </Button>
    </form>
  );
};

export default withContainer(LoginSignup, { containerClass: "m-auto" });
