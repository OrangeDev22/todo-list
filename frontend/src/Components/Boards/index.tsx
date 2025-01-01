import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../state";
import axiosIntance from "../../axios";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import cc from "classcat";
import TaskCard from "../TaskCard";
import NewTaskCard from "../NewTaskCard";
import { BoardType } from "../../types";

const Boards = () => {
  const user = useSelector((state: State) => state.user);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const header = {
    Authorization: `Bearer ${user?.token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      await axiosIntance
        .get("/boards?include_tasks=true", {
          headers: header,
        })
        .then((response) => {
          // setTaskGroupFromDb(arrayToObject(response.data));
          console.log("--response", response);
          setBoards(response.data.boards);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  const onDragEnd = (result: DropResult) => {
    console.log("--on drag end");
    const { source, destination, type } = result;

    // Didn't drop anything
    if (!destination) return;

    // Did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

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
      // Reordering within the same group
      sourceBoard.tasks.splice(destination.index, 0, movedTask);

      // Update order for tasks in the same group
      sourceBoard.tasks.forEach((task, index) => {
        task.order = index;
      });
    } else {
      // Moving between different groups
      destinationBoard.tasks.splice(destination.index, 0, movedTask);

      // Update order for tasks in both groups
      sourceBoard.tasks.forEach((task, index) => {
        task.order = index;
      });
      destinationBoard.tasks.forEach((task, index) => {
        task.order = index;
      });
    }

    setBoards([...boards]);
  };

  if (loading) return <div>Loading...</div>;
  console.log("--boards", boards);
  return (
    <div className="flex">
      {/* <div>Boards</div> */}
      <DragDropContext onDragEnd={onDragEnd}>
        {boards.map((board) => {
          return (
            <div key={board.id}>
              <div className="m-2 bg-neutral-300 rounded-md overflow-hidden flex flex-col p-2">
                <h2>{board.name}</h2>

                <Droppable
                  droppableId={board.id.toString()}
                  key={board.id}
                  type="ROW"
                >
                  {(provided, snapshot) => {
                    return (
                      <div
                        className={cc([
                          "p-1 w-64 min-h-32",
                          { "bg-sky-200": snapshot.isDraggingOver },
                        ])}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        data-testid={`group-task-${board.id}`}
                      >
                        {board.tasks.map((task, index) => {
                          return (
                            <Draggable
                              key={task.id.toString()}
                              draggableId={task.id.toString()}
                              index={task.order}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                    data-testid={`task-${task.id}`}
                                  >
                                    <TaskCard
                                      content={task.content}
                                      isDragging={snapshot.isDragging}
                                      boardId={board.id}
                                      taskId={task.id}
                                      onDeletePressed={async (
                                        boardId,
                                        taskId
                                      ) => {
                                        const boardIndex = boards.findIndex(
                                          (board) => board.id === boardId
                                        );

                                        if (boardIndex === -1) {
                                          console.error("Board not found");
                                          return;
                                        }

                                        const board = boards[boardIndex];

                                        // Find and remove the task
                                        board.tasks = board.tasks.filter(
                                          (task) => task.id !== taskId
                                        );

                                        // Update the order property of remaining tasks
                                        board.tasks.forEach((task, index) => {
                                          task.order = index;
                                        });

                                        // Update state
                                        setBoards([...boards]);
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
                {selectedGroup && selectedGroup === board.id && (
                  <NewTaskCard
                    boardId={board.id}
                    onCancel={() => {
                      setSelectedGroup(null);
                    }}
                    onSubmitCompleted={(newTask, boardId) => {
                      console.log("--new task", newTask);
                      console.log("--groupid", boardId);
                      setBoards((prevBoard) =>
                        prevBoard.map((board) =>
                          board.id === boardId
                            ? {
                                ...board,
                                tasks: [
                                  ...board.tasks,
                                  { ...newTask, order: board.tasks.length },
                                ],
                              }
                            : board
                        )
                      );
                      setSelectedGroup(null);
                    }}
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
