import { differenceWith, flatMap, isEqual } from "lodash";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { BoardType, Task } from "../../types";
import axiosInstance from "../../axios";

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

export const handleDragEnd = async (
  result: DropResult,
  boards: BoardType[],
  originalBoards: BoardType[],
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>,
  restoreScrollContainerPointer: () => void
) => {
  const { source, destination, type } = result;

  if (
    !destination ||
    (source.droppableId === destination.droppableId &&
      source.index === destination.index)
  ) {
    restoreScrollContainerPointer();
    return;
  }

  if (type === "TASK") {
    const sourceGroupIndex = boards.findIndex(
      (board) => board.id.toString() === source.droppableId
    );

    const destinationBoardIndex = boards.findIndex(
      (board) => board.id.toString() === destination.droppableId
    );

    const sourceBoard = boards[sourceGroupIndex];
    const destinationBoard = boards[destinationBoardIndex];

    const [movedTask] = sourceBoard.tasks.splice(source.index, 1);

    if (sourceBoard === destinationBoard) {
      // Reordering within the same board
      sourceBoard.tasks.splice(destination.index, 0, movedTask);
    } else {
      // Moving between different boards
      destinationBoard.tasks.splice(destination.index, 0, movedTask);
    }

    // Update task orders
    sourceBoard.tasks.forEach((task, index) => {
      task.order = index;
    });

    if (sourceBoard !== destinationBoard) {
      destinationBoard.tasks.forEach((task, index) => {
        task.order = index;
      });
    }

    setBoards([...boards]);

    try {
      await axiosInstance.patch("/tasks", {
        tasks: getChangedTasks(boards, originalBoards),
      });
    } catch (error) {
      console.error("--error", error);
    }
  } else if (type === "BOARD") {
    const [movedBoard] = boards.splice(source.index, 1);
    boards.splice(destination.index, 0, movedBoard);

    // Update board orders
    boards.forEach((board, index) => {
      board.order = index;
    });

    setBoards([...boards]);
    const affectedBoards = getChangedBoards(boards, originalBoards).map(
      ({ id, name, order }) => ({ id, name, order })
    );

    try {
      await axiosInstance.patch("/boards", {
        boards: affectedBoards,
      });
    } catch (error) {
      console.error("--error", error);
    }
  }

  restoreScrollContainerPointer();
};
