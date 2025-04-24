import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../InputField";
import Button from "../Button";
import axios from "../../axios";
import { loginFormSchema } from "./schema";
import { setUser } from "../../state/reducers/userSlice";

type LoginFormData = z.infer<typeof loginFormSchema>;

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [responseError, setResponseError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    try {
      const response = await axios.get("/auth/signin", {
        params: { email, password },
      });

      const { userData, expirationDate } = response.data;

      localStorage.setItem("token_expires_at", expirationDate);
      dispatch(setUser(userData));
      setResponseError("");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.msg || "Login failed";
      setResponseError(message);

      if (message.toLowerCase().includes("email")) {
        setError("email", { message: "" });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message: "" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div>
        <label htmlFor="email">Email</label>
        <InputField
          id="email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <InputField
          id="password"
          type="password"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />
      </div>

      <ErrorMessage message={responseError} />

      <Button
        fulLWidth
        data-testid="button-sigin"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Loading..." : "Login"}
      </Button>

      <div className="my-2 text-sm" data-testid="set-signup-screen">
        Need an account?{" "}
        <Link to="/signup" className="text-cyan-500 hover:underline">
          Register Here
        </Link>
      </div>
    </form>
  );
};

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className="text-red-600 text-sm mt-2" role="alert">
      {message}
    </div>
  );
};


export default SignInForm;
