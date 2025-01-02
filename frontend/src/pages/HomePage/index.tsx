import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TaskGroupType } from "../../default-data";
import withContainer from "../../hoc/withContainer";
import { State } from "../../state";
import DashBoard from "../../Components/DashBoard";
// import { arrayToObject } from "../../utils/arrayToObject";
import { useNavigate } from "react-router";
import Boards from "../../Components/Boards";

function HomePage() {
  const user = useSelector((state: State) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/sigin");
  }, [user]);

  return (
    <div>
      {/* <DashBoard initialTaskGroups={tasksGroupFromDb} /> */}
      <Boards />
    </div>
  );
}

export default withContainer(HomePage);
