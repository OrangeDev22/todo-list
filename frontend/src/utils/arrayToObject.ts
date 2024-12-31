import { Task, TaskGroupType } from "../default-data";

type TaasksGroupFromDb = {
  id: number;
  name: string;
  tasks: Task[];
};

export const arrayToObject = (array: TaasksGroupFromDb[]): TaskGroupType => {
  let newGroup = {};
  array.forEach((group) => {
    const { id, name, tasks } = group;
    newGroup = { ...newGroup, [id]: { name, tasks: tasks } };
  });
  return newGroup;
};
