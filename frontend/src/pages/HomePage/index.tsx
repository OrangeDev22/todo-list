import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TaskGroupType } from "../../default-data";
import withContainer from "../../hoc/withContainer";
import { State } from "../../state";
import DashBoard from "../../Components/DashBoard";
import axios from "../../axios";
// import { arrayToObject } from "../../utils/arrayToObject";
import { useNavigate } from "react-router";

function HomePage() {
  const [tasksGroupFromDb, setTaskGroupFromDb] = useState<TaskGroupType>();
  const [loading, setLoading] = useState(true);
  const [creatingDefaultData, setCreatingDefaultData] = useState(false);
  const user = useSelector((state: State) => state.user);
  const navigate = useNavigate();
  const header = {
    Authorization: `Bearer ${user?.token}`,
  };
  useEffect(() => {
    console.log("--user", user);
    if (!user) navigate("/sigin");
  }, [user]);
  // const createDefaultTasks = async () => {
  //   const deafaultGroupsArray = Object.entries(defaultGroupsTask).map(
  //     ([, group]) => group
  //   );
  //   let newTaskGroups = {};
  //   for (let index = 0; index < deafaultGroupsArray.length; index++) {
  //     const { name } = deafaultGroupsArray[index];
  //     await axios
  //       .post(
  //         "task/task_group",
  //         { name, userId: user?.id },
  //         { headers: header }
  //       )
  //       .then((response) => {
  //         const newGroupTask = response.data;
  //         newTaskGroups = {
  //           ...newTaskGroups,
  //           [newGroupTask.id]: {
  //             name: newGroupTask.name,
  //             tasks: newGroupTask.tasks,
  //           },
  //         };
  //       });
  //   }
  //   setTaskGroupFromDb(newTaskGroups);
  //   setLoading(false);
  // };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/boards?include_tasks=true", {
          headers: header,
        })
        .then((response) => {
          // setTaskGroupFromDb(arrayToObject(response.data));
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div>Loading...</div>
        {creatingDefaultData && <div>Creating Dashboard...</div>}
      </>
    );
  }

  return <div>{/* <DashBoard initialTaskGroups={tasksGroupFromDb} /> */}</div>;
}

export default withContainer(HomePage);
