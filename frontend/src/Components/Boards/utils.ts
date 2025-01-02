import { differenceWith, flatMap, isEqual } from "lodash";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { BoardType, Task } from "../../types";

export const getChangedBoards = (
  boards: BoardType[],
  originalBoards: BoardType[]
) => differenceWith(boards, originalBoards, isEqual);

export const getChangedTasks = (
  boards: BoardType[],
  originalBoards: BoardType[]
) => {
  // Detect tasks with changed order or boardId
  const currentTasks = flatMap(boards, (board) =>
    board.tasks.map((task) => ({
      id: task.id,
      order: task.order,
      boardId: board.id,
    }))
  );

  const originalTasks = flatMap(originalBoards, (board) =>
    board.tasks.map((task) => ({
      id: task.id,
      order: task.order,
      boardId: board.id,
    }))
  );

  return differenceWith(currentTasks, originalTasks, isEqual);
};

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
