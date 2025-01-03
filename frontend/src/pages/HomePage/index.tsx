import { useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../../state";
import { useNavigate } from "react-router";
import Boards from "../../Components/Boards";
import BoardsProvider from "../../providers/BoardsProvider";

function HomePage() {
  const user = useSelector((state: State) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/sigin");
  }, [user]);

  return (
    <div className="bg-gradient-to-r from-indigo-800 to-violet-500 h-[calc(100vh-56px)]">
      {/* <DashBoard initialTaskGroups={tasksGroupFromDb} /> */}
      <BoardsProvider>
        <Boards />
      </BoardsProvider>
    </div>
  );
}

export default HomePage;
