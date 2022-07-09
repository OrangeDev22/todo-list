import { v4 as uuid } from "uuid";

export const dummyTasks = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
];

export const defaultGroupsTask: TaskGroupType = {
  [uuid()]: {
    name: "Requested",
    items: dummyTasks,
  },
  [uuid()]: {
    name: "To do",
    items: [],
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};

export interface Task {
  id: string;
  content: string;
}

export interface TaskGroupType {
  [x: string]: {
    name: string;
    items: Task[];
  };
}
