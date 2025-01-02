import { differenceWith, flatMap, isEqual } from "lodash";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { BoardType, Task } from "../../types";

export const isTaskDragEndValid = (
  source: DraggableLocation,
  destination: DraggableLocation | undefined,
  type: string
) => {
  // Didn't drop anything
  if (!destination) return false;

  // Did not move anywhere - can bail early
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return false;

  if (type !== "TASK") return false;

  return true;
};

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

export const replaceTempTaskId = (
  newTask: Task,
  boardId: number,
  boards: BoardType[],
  newTaskId: number
) => {
  const boardIndex = boards.findIndex((board) => board.id === boardId);
  let tasks = boards[boardIndex].tasks;
  const taskIndex = tasks.findIndex((task) => task.id === newTask.id);
  console.log("--boards", boards);
  console.log("--taskIndex", taskIndex);
  console.log("--tasks", tasks);
  tasks[taskIndex].id = newTaskId;
  boards[boardIndex].tasks = tasks;
  return boards;
};
