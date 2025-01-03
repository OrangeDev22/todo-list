import { useEffect, useMemo, useRef, useState } from "react";
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
import NewBoardCard from "../NewBoardCard";
import { useBoards } from "../../hooks/useBoards";
import Board from "./components/Board";
import { deleteTask } from "../../utils/tasksUtils";

const Boards = () => {
  const { boards, loading, originalBoards, setBoards } = useBoards();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkScrollbarVisibility = () => {
      if (scrollContainer.current) {
        const hasHorizontalScrollbar =
          scrollContainer.current.scrollWidth >
          scrollContainer.current.clientWidth;
        setIsScrollbarVisible(hasHorizontalScrollbar);
      }
    };

    checkScrollbarVisibility();

    window.addEventListener("resize", checkScrollbarVisibility);
    return () => window.removeEventListener("resize", checkScrollbarVisibility);
  }, []);

  const restoreScrollContainerPointer = () => {
    if (scrollContainer.current) {
      scrollContainer.current.style.pointerEvents = "auto";
    }
  };

  const addNewTask = (newTask: Task, boardId: number) => {
    setBoards((prevBoards) => addNewTaskToArray(newTask, boardId, prevBoards));
    setSelectedGroup(null);
  };

  const addNewBoard = (newBoard: BoardType) => {
    setBoards([...boards, newBoard]);
  };

  const onDragStart = () => {
    if (scrollContainer.current) {
      scrollContainer.current.style.pointerEvents = "none";
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      restoreScrollContainerPointer();
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

      try {
        await axiosInstance.patch("/boards", {
          boards: affectedBoards,
        });
      } catch (error) {
        console.error("--error", error);
      }
    }

    restoreScrollContainerPointer();
  };

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollContainer.current) {
      const delta = e.movementX * -1;
      scrollContainer.current.scrollLeft += delta;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`overflow-x-auto h-full ${
        isScrollbarVisible ? "cursor-grab" : ""
      }`}
      ref={scrollContainer}
      onMouseDown={(e) => e.preventDefault()} // Prevent text selection
      onMouseMove={(e) => {
        if (e.buttons === 1) handleScroll(e);
      }}
    >
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="BOARD" direction="horizontal">
          {(provided) => (
            <div
              className="flex items-start h-full w-full "
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards.map((board) => {
                return (
                  <Board
                    board={board}
                    onAddTask={addNewTask}
                    onSelectGroup={setSelectedGroup}
                    onDeleteTask={(taski) =>
                      deleteTask(board.id, taski, boards, setBoards)
                    }
                    selectedGroup={selectedGroup}
                  />
                );
              })}
              {provided.placeholder}

              <NewBoardCard
                onSubmitCompleted={addNewBoard}
                boardsLength={boards.length}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Boards;
