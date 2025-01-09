import { useSelector } from "react-redux";
import SiginForm from "../../Components/SiginForm";
import withAuthContainer from "../../hoc/withAuthContainer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ReduxState } from "../../state/store";

const SiginPage = () => {
  const user = useSelector((state: ReduxState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return <SiginForm />;
};

export default withAuthContainer(SiginPage, { leftAndRight: true });
