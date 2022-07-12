import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { defaultGroupsTask, TaskGroupType } from "../../default-data";
import withContainer from "../../hoc/withContainer";
import { State } from "../../state";
import DashBoard from "../DashBoard";
import axios from "../../axios";
import { arrayToObject } from "../../utils/arrayToObject";

function Homepage() {
  const [tasksGroupFromDb, setTaskGroupFromDb] = useState<TaskGroupType>({});
  const [loading, setLoading] = useState(true);
  const [creatingDefaultData, setCreatingDefaultData] = useState(false);
  const user = useSelector((state: State) => state.user);
  const header = {
    Authorization: `Bearer ${user?.token}`,
  };

  const createDefaultTasks = async () => {
    const deafaultGroupsArray = Object.entries(defaultGroupsTask).map(
      ([groupId, group]) => group
    );
    let newTaskGroups = {};
    for (let index = 0; index < deafaultGroupsArray.length; index++) {
      const { name } = deafaultGroupsArray[index];
      await axios
        .post(
          "task/task_group",
          { name, userId: user?.id },
          { headers: header }
        )
        .then((response) => {
          const newGroupTask = response.data;
          newTaskGroups = {
            ...newTaskGroups,
            [newGroupTask.id]: {
              name: newGroupTask.name,
              tasks: newGroupTask.tasks,
            },
          };
        });
    }
    setTaskGroupFromDb(newTaskGroups);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/task/get_group_tasks", {
          headers: header,
        })
        .then((response) => {
          if (response.data.length === 0) {
            setCreatingDefaultData(true);
            createDefaultTasks();
          } else {
            setTaskGroupFromDb(arrayToObject(response.data));
            setLoading(false);
          }
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

  return (
    <div>
      <DashBoard initialTaskGroups={tasksGroupFromDb} />
    </div>
  );
}

export default withContainer(Homepage);
