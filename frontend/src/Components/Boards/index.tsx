import { Fragment, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../axios";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import NewTaskCard from "../NewTaskCard";
import { BoardType, Task } from "../../types";
import TasksList from "../TasksList";
import { cloneDeep } from "lodash";
import { addNewTaskToArray, getChangedBoards, getChangedTasks } from "./utils";
import { snapshot } from "node:test";

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

    if (!destination) {
      return;
    }

    // Did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
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

      console.log("--affected boards", affectedBoards);
      try {
        await axiosInstance.patch("/boards", {
          boards: affectedBoards,
        });
      } catch (error) {
        console.error("--error", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="BOARD" direction="horizontal">
          {(provided) => (
            <div
              className="flex items-start h-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards.map((board) => {
                return (
                  <Draggable
                    key={`board-id-${board.id}`}
                    draggableId={`board-id-${board.id}`}
                    index={board.order}
                  >
                    {(provided) => {
                      return (
                        <div
                          className="m-2 bg-neutral-800 rounded-xl overflow-hidden flex flex-col p-2 text-gray-300 space-y-3"
                          key={board.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
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

                          <button
                            className="hover:bg-neutral-700 rounded-md"
                            onClick={() => setSelectedGroup(board.id)}
                          >
                            <span className="font-bold mr-2 self-start">+</span>
                            Add a Task
                          </button>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Boards;
