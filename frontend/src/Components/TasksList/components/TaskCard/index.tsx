import { useState } from "react";
import cc from "classcat";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete.svg";
import EditValue from "../../../EditValue";
import MenuDropDown from "../../../MenuDropDown";
import { TaskMenuActions, taskMenuOptions } from "./utils";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const TaskCard = ({
  content,
  isDragging,
  onDeletePressed,
  onEditTaskContent,
}: {
  content: string;
  isDragging: boolean;
  onDeletePressed: () => void;
  onEditTaskContent: (newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (newValue: string) => {
    if (newValue !== content) onEditTaskContent(newValue);

    setIsEditing(false);
  };

  const handleBoardAction = (key: string) => {
    switch (key) {
      case TaskMenuActions.DELETE_TASK:
        onDeletePressed();
        break;
      case TaskMenuActions.EDIT_TASK:
        setIsEditing(true);
        break;
      default:
        return;
    }
  };

  return (
    <div
      className={cc([
        "p-2 shadow-lg rounded-lg break-words relative max-w-[248px]",
        { "bg-indigo-700": isDragging },
        { "bg-indigo-500": !isDragging },
      ])}
    >
      {!isEditing ? (
        <div className="flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
            {content}
          </div>

          <MenuDropDown
            items={taskMenuOptions}
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
      ) : (
        <EditValue initialValue={content} onComplete={handleContentChange} />
      )}
    </div>
  );
};

export default TaskCard;
