import { Draggable } from "react-beautiful-dnd";
import { BoardType, Task } from "../../../../types";
import TasksList from "../../../TasksList";
import NewTaskCard from "../../../NewTaskCard";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { BoardMenuActions, BoardMenuOptions } from "../../utils";
import MenuDropDown from "../../../MenuDropDown";
import axiosInstance from "../../../../axios";
import { useState } from "react";
import EditValue from "../../../EditValue";

interface Props {
  board: BoardType;
  selectedGroup: number | null;
  onSelectGroup: (boardId: number | null) => void;
  onAddTask: (task: Task, boardId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTaskContent: (newContent: string, taskId: number) => void;
  onOpenMenu: () => void;
  onDeleteBoard: () => void;
  onEditBoardName: (newName: string) => void;
  isMenuOpen: boolean;
}

const Board = ({
  board,
  selectedGroup,
  onSelectGroup,
  onAddTask,
  onDeleteTask,
  onDeleteBoard,
  onEditBoardName,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (newName: string) => {
    if (newName !== board.name) onEditBoardName(newName);

    setIsEditing(false);
  };

  const handleBoardAction = async (key: string) => {
    switch (key) {
      case BoardMenuActions.DELETE_BOARD:
        const response = await axiosInstance.delete(`/boards/${board.id}`);

        if (response.data.record) {
          onDeleteBoard();
        }

        break;
      case BoardMenuActions.ADD_TASK:
        onSelectGroup(board.id);
        break;
      default:
        return;
    }
  };

  return (
    <Draggable
      key={`board-id-${board.id}`}
      draggableId={`board-id-${board.id}`}
      index={board.order}
    >
      {(provided) => {
        return (
          <div
            className="m-2 bg-neutral-800 rounded-xl overflow-hidden min-w-[272px] flex flex-col p-2 text-gray-300 space-y-3"
            key={board.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <div className="flex justify-between items-center mx-2 mt-2">
              {!isEditing ? (
                <h2
                  className="font-semibold cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  {board.name}
                </h2>
              ) : (
                <EditValue
                  initialValue={board.name}
                  onComplete={handleNameChange}
                />
              )}
              <MenuDropDown
                items={BoardMenuOptions}
                position="right"
                menuClassName="bg-[#323940] shadow-md rounded-md text-sm"
                listClassName="py-0"
                itemMenuClassName="!text-gray-300 px-3 hover:bg-neutral-700 mb-2"
                headerTitle="Board actions"
                onActionClicked={handleBoardAction}
              >
                <button className="p-1 rounded-md hover:bg-neutral-600">
                  <EllipsisHorizontalIcon width={20} color="white" />
                </button>
              </MenuDropDown>
            </div>

            <TasksList
              tasks={board.tasks}
              originBoardId={board.id}
              onDeleteClicked={onDeleteTask}
            />
            {selectedGroup === board.id && (
              <NewTaskCard
                boardId={board.id}
                onCancel={() => {
                  onSelectGroup(null);
                }}
                onSubmitCompleted={onAddTask}
                tasks={board.tasks}
              />
            )}

            <button
              className="hover:bg-neutral-700 rounded-md"
              onClick={() => onSelectGroup(board.id)}
            >
              <span className="font-bold mr-2 self-start">+</span>
              Add a Task
            </button>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Board;
