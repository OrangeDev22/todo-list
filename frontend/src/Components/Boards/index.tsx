import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../state";
import axiosIntance from "../../axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import NewTaskCard from "../NewTaskCard";
import { BoardType, Task } from "../../types";
import TasksList from "../TasksList";
import { cloneDeep, differenceWith, flatMap, isEqual } from "lodash";

const Boards = () => {
  const user = useSelector((state: State) => state.user);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const originalBoards = useMemo(() => {
    return cloneDeep(boards);
  }, [boards]);
  // const header = {
  //   Authorization: `Bearer ${user?.token}`,
  // };

  useEffect(() => {
    const fetchData = async () => {
      await axiosIntance
        .get("/boards?include_tasks=true", {
          // headers: header,
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

      // Collect affected tasks and update their order
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

      // Collect affected tasks and update their order
    }
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

    console.log("---current tasks", currentTasks);
    console.log("--originalTasks", originalTasks);
    const changedTasks = differenceWith(currentTasks, originalTasks, isEqual);
    console.log("--changedTasks", changedTasks);
    setBoards([...boards]);
  };

  const addNewTask = (newTask: Task, boardId: number) => {
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
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* <div>Boards</div> */}
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
