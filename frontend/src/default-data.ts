const dummyTasks = [
  { id: "5", content: "First task" },
  { id: "6", content: "Second task" },
  { id: "7", content: "Third task" },
  { id: "8", content: "Fourth task" },
  { id: "9", content: "Fifth task" },
];

export const defaultGroupsTask: TaskGroupType = {
  ["1"]: {
    name: "To do",
    tasks: dummyTasks,
  },

  ["2"]: {
    name: "In Progress",
    tasks: [],
  },
  ["3"]: {
    name: "Done",
    tasks: [],
  },
};

export interface Task {
  id: string;
  content: string;
}

export interface TaskGroupType {
  [x: string]: {
    name: string;
    tasks: Task[];
  };
}
