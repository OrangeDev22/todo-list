import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BoardType, Task } from "../types";
import { cloneDeep } from "lodash";
import axiosInstance from "../axios";
import { addNewTaskToArray } from "./utils";

interface useBoardType {
  boards: BoardType[];
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
  setSelectedBoard: React.Dispatch<React.SetStateAction<number | null>>;
  loading: boolean;
  originalBoards: BoardType[];
  selectedBoard: number | null;
  addNewBoard: (newBoard: BoardType) => void;
  addNewTask: (newTask: Task, boardId: number) => void;
  editBoard: (newName: string, id: number) => void;
  removeBoard: (boardId: number) => void;
  editTask: (newContent: string, taskId: number, boardId: number) => void;
  deleteTask: (boardId: number, taskId: number) => void;
}

const BoardsDataContext = createContext<useBoardType>({
  boards: [],
  loading: true,
  originalBoards: [],
  setSelectedBoard: () => {},
  setBoards: () => {},
  selectedBoard: null,
  addNewBoard: async () => {},
  addNewTask: () => {},
  editBoard: () => {},
  removeBoard: async () => {},
  deleteTask: () => {},
  editTask: () => {},
});

export const useBoards = () => useContext(BoardsDataContext);

interface Props {
  children: React.ReactNode;
}

const BoardsProvider = ({ children }: Props) => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const originalBoards = useMemo(() => cloneDeep(boards), [boards]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axiosInstance.get("/boards?include_tasks=true");
        setBoards(response.data.boards);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const addNewBoard = (newBoard: BoardType) => {
    sessionStorage.setItem("new_board", newBoard.id.toString());
    setBoards([...boards, newBoard]);
  };

  const addNewTask = (newTask: Task, boardId: number) => {
    setBoards((prevBoards) => addNewTaskToArray(newTask, boardId, prevBoards));
    setSelectedBoard(null);
  };

  const editBoard = (newName: string, id: number) => {
    const updatedBoards = boards.map((board) =>
      board.id === id ? { ...board, name: newName } : board
    );
    setBoards(updatedBoards);
  };

  const removeBoard = (boardId: number) => {
    setBoards((prevBoards) =>
      prevBoards.filter((prevBoard) => prevBoard.id !== boardId)
    );
  };

  const deleteTask = (boardId: number, taskId: number) => {
    const boardIndex = boards.findIndex((board) => board.id === boardId);

    if (boardIndex === -1) {
      console.error("Board not found");
      return;
    }

    const updatedBoards = [...boards];
    const board = updatedBoards[boardIndex];

    board.tasks = board.tasks.filter((task) => task.id !== taskId);
    board.tasks.forEach((task, index) => {
      task.order = index;
    });

    setBoards(updatedBoards);
  };

  const editTask = async (
    newContent: string,
    taskId: number,
    boardId: number
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.map((task) =>
                task.id === taskId ? { ...task, content: newContent } : task
              ),
            }
          : board
      )
    );
  };

  return (
    <BoardsDataContext.Provider
      value={{
        boards,
        setBoards,
        setSelectedBoard,
        loading,
        originalBoards,
        selectedBoard,
        addNewTask,
        editBoard,
        removeBoard,
        deleteTask,
        addNewBoard,
        editTask,
      }}
    >
      {children}
    </BoardsDataContext.Provider>
  );
};

export default BoardsProvider;
