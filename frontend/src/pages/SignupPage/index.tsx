import { useEffect } from "react";
import SignupForm from "../../Components/SignupForm";
import withAuthContainer from "../../hoc/withAuthContainer";
import { useSelector } from "react-redux";
import { ReduxState } from "../../state/store";
import { useNavigate } from "react-router";

const SignupPage = () => {
  const user = useSelector((state: ReduxState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return <SignupForm />;
};

export default withAuthContainer(SignupPage, { leftAndRight: true });
