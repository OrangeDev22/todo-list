import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import InputField from "../InputField";
import Button from "../Button";
import axios from "../../axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { setUser } from "../../state/reducers/userSlice";

type LoginFormData = z.infer<typeof loginFormSchema>;

const SiginForm = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [responseError, setResponseError] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    await axios
      .get("/auth/signin", {
        params: { email, password },
      })
      .then((response) => {
        const { userData, expirationDate } = response.data;

        localStorage.setItem("token_expires_at", expirationDate);

        dispatch(setUser(userData));
        setResponseError("");
        navigate("/");
      })
      .catch((error) => {
        setResponseError(error.response.data?.msg);
      });
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div>
        <label htmlFor="email">Email</label>
        <InputField
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <InputField
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
          type="password"
        />
      </div>
      {responseError && <div className="text-red-600">{responseError}</div>}

      <Button $fluid data-testid="button-sigin">
        {isSubmitting ? "Loading..." : "Login"}
      </Button>

      <div className="my-2">
        Need an account?{" "}
        <Link
          to="/signup"
          className="text-cyan-500 cursor-pointer"
          data-testid="set-signin-screen"
        >
          Register Here
        </Link>
      </div>
    </form>
  );
};

export default SiginForm;
