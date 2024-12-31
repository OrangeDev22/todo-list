import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state";
import InputField from "../InputField";
import Button from "../Button";
import axios from "../../axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type Props = {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

type loginFormData = z.infer<typeof loginFormSchema>;

const SiginForm = ({ submitting, setSubmitting }: Props) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = bindActionCreators(actionCreators, dispatch);
  const [responseError, setResponseError] = useState("");

  const onSubmit = async (data: loginFormData) => {
    const { email, password } = data;
    setSubmitting(true);
    await axios
      .get("/auth/signin", {
        params: { email, password },
      })
      .then((response) => {
        const { id, email, username, token } = response.data;
        setUser({ id, email, username, token });
        setResponseError("");
      })
      .catch((error) => {
        setResponseError(error.response.data?.msg);
        setSubmitting(false);
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
        />
      </div>
      {responseError && <div className="text-red-600">{responseError}</div>}

      <Button $fluid data-testid="button-sigin">
        {submitting ? "Loading..." : "Login"}
      </Button>
    </form>
  );
};

export default SiginForm;
