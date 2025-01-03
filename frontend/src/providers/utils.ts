import { BoardType, Task } from "../types";

export const addNewTaskToArray = (
  newTask: Task,
  boardId: number,
  boards: BoardType[]
) => {
  return boards.map((board) =>
    board.id === boardId
      ? {
          ...board,
          tasks: [...board.tasks, { ...newTask, order: board.tasks.length }],
        }
      : board
  );
};
