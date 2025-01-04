import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Boards from "../../Components/Boards";
import BoardsProvider from "../../providers/BoardsProvider";
import { ReduxState } from "../../state/store";

function HomePage() {
  const user = useSelector((state: ReduxState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/sigin");
  }, [user]);

  return (
    <div className="bg-gradient-to-r from-indigo-800 to-violet-500 h-[calc(100vh-56px)]">
      <BoardsProvider>
        <Boards />
      </BoardsProvider>
    </div>
  );
}

export default HomePage;
