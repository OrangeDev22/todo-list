import { useEffect, useMemo, useState } from "react";
import { BoardType } from "./../types";
import { cloneDeep } from "lodash";
import axiosInstance from "../axios";
export const useBoards = () => {
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

  return { boards, setBoards, loading, originalBoards };
};
