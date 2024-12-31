import SiginForm from "../../Components/SiginForm";
import withAuthContainer from "../../hoc/withAuthContainer";

const SiginPage = () => {
  return <SiginForm />;
};

export default withAuthContainer(SiginForm, { leftAndRight: true });
