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
