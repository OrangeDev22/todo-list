import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../axios";
import InputField from "../InputField";
import Button from "../Button";
import { Link, useNavigate } from "react-router";
import { setUser } from "../../state/reducers/userSlice";

type SignupFormData = z.infer<typeof signupFormSchema>;

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [responseError, setResponseError] = useState("");
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: "", password: "", username: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    const { email, password, username } = data;
    await axios
      .post("/auth/signup", {
        email,
        password,
        username,
      })
      .then((response) => {
        const { userData, expirationDate } = response.data;

        localStorage.setItem("token_expires_at", expirationDate);

        dispatch(setUser(userData));
        navigate("/");
      })
      .catch((e) => {
        setResponseError(e.response.data?.message);
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
        <label htmlFor="username">Username</label>
        <InputField
          {...register("username")}
          isError={!!errors.username}
          errorMessage={errors.username?.message}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <InputField
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
          type="password"
        />
      </div>

      {responseError && <div className="text-red-600">{responseError}</div>}

      <Button fulLWidth data-testid="button-signup">
        {isSubmitting ? "Loading..." : "Continue"}
      </Button>

      <div className="my-2">
        Have an account?{" "}
        <Link
          to="/sigin"
          className="text-cyan-500 cursor-pointer"
          data-testid="set-signin-screen"
        >
          Sigin Here
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
