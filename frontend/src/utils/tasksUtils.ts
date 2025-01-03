import axiosInstance from "../axios";
import { BoardType } from "../types";

export const deleteTask = async (
  boardId: number,
  taskId: number,
  boards: BoardType[],
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>
) => {
  const boardIndex = boards.findIndex((board) => board.id === boardId);

  if (boardIndex === -1) {
    console.error("Board not found");
    return;
  }

  try {
    await axiosInstance.delete(`/tasks/${taskId}`);
    const updatedBoards = [...boards];
    const board = updatedBoards[boardIndex];

    board.tasks = board.tasks.filter((task) => task.id !== taskId);
    board.tasks.forEach((task, index) => {
      task.order = index;
    });

    setBoards(updatedBoards);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
