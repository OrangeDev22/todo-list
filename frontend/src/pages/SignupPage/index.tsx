import SignupForm from "../../Components/SignupForm/inddex";
import withAuthContainer from "../../hoc/withAuthContainer";

const SignupPage = () => {
  return <SignupForm />;
};

export default withAuthContainer(SignupPage, { leftAndRight: true });
