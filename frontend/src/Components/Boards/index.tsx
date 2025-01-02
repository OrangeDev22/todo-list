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
  replaceTempTaskId,
} from "./utils";

const Boards = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [tempIdToRealIdMap, setTempIdToRealIdMap] = useState<
    Map<number, number>
  >(new Map());

  console.log("--boards", boards);
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

  const updateTaskId = (tempId: number, realId: number, boardId: number) => {
    setBoards((prevBoards) => {
      return prevBoards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            tasks: board.tasks.map((task) =>
              task.id === tempId ? { ...task, id: realId } : task
            ),
          };
        }
        return board;
      });
    });

    // Update the tempId to realId map
    setTempIdToRealIdMap((prevMap) => new Map(prevMap.set(tempId, realId)));
  };

  const addNewTask = async (newTask: Task, boardId: number) => {
    // Optimistically add the task with the temp ID
    setBoards((prevBoards) => addNewTaskToArray(newTask, boardId, prevBoards));

    try {
      // 1. Make the request to create the task
      const response = await axiosInstance.post("/tasks", {
        boardId,
        content: newTask.content,
        order: newTask.order,
      });

      const realTaskId = response.data.record?.id;

      // 2. Update the task with the real ID in the state
      updateTaskId(newTask.id, realTaskId, boardId);

      // 3. Now that the task has been created, proceed with the drag-and-drop logic
      // This will allow the `onDragEnd` function to run successfully, as the real ID is already set.
    } catch (error) {
      console.error("--error", error);

      // Rollback the temporary task on error
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          tasks: board.tasks.filter((task) => task.id !== newTask.id),
        }))
      );
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!isTaskDragEndValid) return;

    const sourceGroupIndex = boards.findIndex(
      (board) => board.id.toString() === source.droppableId
    );
    const destinationBoardIndex = boards.findIndex(
      (board) => board.id.toString() === destination?.droppableId
    );

    const sourceBoard = boards[sourceGroupIndex];
    const destinationBoard = boards[destinationBoardIndex];

    const [movedTask] = sourceBoard.tasks.splice(source.index, 1);

    // Ensure realId is used before moving
    if (tempIdToRealIdMap.has(movedTask.id)) {
      movedTask.id = tempIdToRealIdMap.get(movedTask.id)!;
    }

    // Handle task movement logic (reorder tasks within the same board or across boards)
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
      // 4. Now perform the patch request after the task creation process is done
      await axiosInstance.patch("/tasks", {
        tasks: getChangedTasks(boards, originalBoards),
      });
    } catch (error) {
      console.error("--error", error);
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
