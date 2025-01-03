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
import {
  addNewTaskToArray,
  getChangedBoards,
  getChangedTasks,
  handleDragEnd,
} from "./utils";
import NewBoardCard from "../NewBoardCard";
import Board from "./components/Board";
import { deleteTask } from "../../utils/tasksUtils";
import useScroll from "../../hooks/useScroll";
import { useBoards } from "../../providers/BoardContext";

const Boards = () => {
  const { boards, loading, originalBoards, setBoards } = useBoards();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedBoardOptions, setSelectedBoardOptions] = useState<
    number | null
  >(null);
  const {
    isScrollbarVisible,
    scrollContainer,
    restoreScrollContainerPointer,
    handleScroll,
  } = useScroll();

  const addNewTask = (newTask: Task, boardId: number) => {
    setBoards((prevBoards) => addNewTaskToArray(newTask, boardId, prevBoards));
    setSelectedGroup(null);
  };

  const editTask = (newContent: string, taskId: number, boardId: number) => {
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

  const removeBoard = (id: number) => {
    setBoards((prevBoards) =>
      prevBoards.filter((prevBoard) => prevBoard.id !== id)
    );
  };

  const addNewBoard = (newBoard: BoardType) => {
    setBoards([...boards, newBoard]);
  };

  const onDragStart = () => {
    if (scrollContainer.current) {
      scrollContainer.current.style.pointerEvents = "none";
    }
  };

  const editBoard = async (newName: string, id: number) => {
    try {
      const response = await axiosInstance.patch(`boards/${id}`, {
        name: newName,
      });

      if (response.data.record) {
        const updatedBoards = boards.map((board) =>
          board.id === id ? { ...board, name: newName } : board
        );
        setBoards(updatedBoards);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`overflow-x-auto h-full ${
        isScrollbarVisible ? "cursor-grab" : ""
      }`}
      ref={scrollContainer}
      onMouseDown={(e) => e.preventDefault()}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleScroll(e);
      }}
    >
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={(result) =>
          handleDragEnd(
            result,
            boards,
            originalBoards,
            setBoards,
            restoreScrollContainerPointer
          )
        }
      >
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
                    onEditTaskContent={(newContent, taskId) =>
                      editTask(newContent, taskId, board.id)
                    }
                    onOpenMenu={() => setSelectedBoardOptions(board.id)}
                    isMenuOpen={board.id === selectedBoardOptions}
                    selectedGroup={selectedGroup}
                    onDeleteBoard={() => removeBoard(board.id)}
                    onEditBoardName={(newName) => editBoard(newName, board.id)}
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
