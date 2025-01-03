import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BoardType } from "../types";
import { cloneDeep } from "lodash";
import axiosInstance from "../axios";

interface useBoardType {
  boards: BoardType[];
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
  loading: boolean;
  originalBoards: BoardType[];
}

const BoardsDataContext = createContext<useBoardType>({
  boards: [],
  loading: true,
  originalBoards: [],
  setBoards: () => {},
});

export const useBoards = () => useContext(BoardsDataContext);

interface Props {
  children: React.ReactNode;
}

const BoardsProvider = ({ children }: Props) => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <BoardsDataContext.Provider
      value={{
        boards,
        setBoards,
        loading,
        originalBoards,
      }}
    >
      {children}
    </BoardsDataContext.Provider>
  );
};

export default BoardsProvider;
