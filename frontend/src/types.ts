export interface Task {
  id: number;
  content: string;
  order: number;
}

export interface BoardType {
  id: number;
  name: string;
  tasks: Task[];
  order: number;
}
