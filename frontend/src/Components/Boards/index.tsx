import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../state";
import axiosIntance from "../../axios";
import { BoardType } from "../../default-data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import cc from "classcat";
import TaskCard from "../TaskCard";
import NewTaskCard from "../NewTaskCard";

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div>Boards</div>
      <DragDropContext onDragEnd={(result) => {}}>
        {boards.map((board) => {
          return (
            <div key={board.id}>
              <h2>{board.name}</h2>
              <div className="m-2 bg-neutral-300 rounded-md overflow-hidden flex flex-col p-2">
                <Droppable droppableId={board.id.toString()} key={board.id}>
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
                        {board.tasks.map((task) => {
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
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
                                      onDeletePressed={async () => {
                                        let newTasks = board.tasks.filter(
                                          (taskToDelete) =>
                                            taskToDelete.id !== task.id
                                        );

                                        // const body = {
                                        //   taskGroupId: +board.id,
                                        //   tasks: newTasks,
                                        // };
                                        // await axios
                                        //   .post("task/set_tasks", body, {
                                        //     headers: {
                                        //       Authorization: `Bearer ${user?.token}`,
                                        //     },
                                        //   })
                                        //   .then(() => {
                                        //     setGroupTasks((prev) => {
                                        //       let copyGroup = prev;
                                        //       copyGroup[groupId].tasks =
                                        //         newTasks;
                                        //       return copyGroup;
                                        //     });
                                        //     setTaskToDelete(task.id);
                                        //   });
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
                      //   setGroupTasks((prev) => {
                      //     let groupCopy = prev;
                      //     groupCopy[groupId].tasks = [
                      //       ...groupCopy[groupId].tasks,
                      //       newTask,
                      //     ];
                      //     return groupCopy;
                      //   });
                      //   setSelectedGroup(null);
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
