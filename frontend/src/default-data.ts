const dummyTasks = [
  { id: "5", content: "First task" },
  { id: "6", content: "Second task" },
  { id: "7", content: "Third task" },
  { id: "8", content: "Fourth task" },
  { id: "9", content: "Fifth task" },
];

export interface Task {
  id: string;
  content: string;
  order: number;
}

export interface TaskGroupType {
  id: number;
  name: string;
  tasks: Task[];
}
