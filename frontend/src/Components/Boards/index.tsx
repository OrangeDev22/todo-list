import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import NewTaskCard from "../NewTaskCard";
import { BoardType, Task } from "../../types";
import TasksList from "../TasksList";
import { cloneDeep } from "lodash";
import {
  addNewTaskToArray,
  getChangedTasks,
  isTaskDragEndValid,
} from "./utils";

const Boards = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const originalBoards = useMemo(() => {
    return cloneDeep(boards);
  }, [boards]);

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/boards?include_tasks=true", {})
        .then((response) => {
          setBoards(response.data.boards);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  const addNewTask = async (newTask: Task, boardId: number) => {
    setBoards((prevBoards) => addNewTaskToArray(newTask, boardId, prevBoards));
    setSelectedGroup(null);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!isTaskDragEndValid) return;

    if (type === "TASK") {
      const sourceGroupIndex = boards.findIndex(
        (board) => board.id.toString() === source.droppableId
      );
      const destinationBoardIndex = boards.findIndex(
        (board) => board.id.toString() === destination?.droppableId
      );

      const sourceBoard = boards[sourceGroupIndex];
      const destinationBoard = boards[destinationBoardIndex];

      const [movedTask] = sourceBoard.tasks.splice(source.index, 1);

      if (sourceBoard === destinationBoard) {
        // Reordering within the same group
        sourceBoard.tasks.splice(destination?.index || 0, 0, movedTask);
        sourceBoard.tasks.forEach((task, index) => {
          task.order = index;
        });
      } else {
        // Moving between different groups
        destinationBoard.tasks.splice(destination?.index || 0, 0, movedTask);
        sourceBoard.tasks.forEach((task, index) => {
          task.order = index;
        });
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
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <DragDropContext onDragEnd={onDragEnd}>
        {boards.map((board) => {
          return (
            <div key={board.id}>
              <div className="m-2 bg-neutral-300 rounded-md overflow-hidden flex flex-col p-2">
                <h2>{board.name}</h2>

                <TasksList
                  tasks={board.tasks}
                  originBoardId={board.id}
                  setBoards={setBoards}
                  boards={boards}
                />
                {selectedGroup && selectedGroup === board.id && (
                  <NewTaskCard
                    boardId={board.id}
                    onCancel={() => {
                      setSelectedGroup(null);
                    }}
                    onSubmitCompleted={addNewTask}
                    tasks={board.tasks}
                  />
                )}
                {!selectedGroup && (
                  <button
                    className="text-neutral-700 w-full hover:bg-neutral-400"
                    onClick={() => setSelectedGroup(board.id)}
                  >
                    <span className="font-bold mr-2">+</span>Add a Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default Boards;
