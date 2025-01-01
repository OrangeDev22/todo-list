import { useState } from "react";
import cc from "classcat";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";

const TaskCard = ({
  boardId,
  taskId,
  content,
  isDragging,
  onDeletePressed,
}: {
  boardId: number;
  taskId: number;
  content: string;
  isDragging: boolean;
  onDeletePressed: (boardId: number, taskId: number) => void;
}) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  return (
    <div
      className={cc([
        "mb-2 p-4 min-h-14 shadow-lg rounded-lg break-words relative",
        { "bg-sky-700": isDragging },
        { "bg-sky-500": !isDragging },
      ])}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      {showDeleteIcon && (
        <div
          onClick={() => onDeletePressed(boardId, taskId)}
          className="bg-white absolute rounded-full -top-1.5 -left-1.5 cursor-pointer"
        >
          <DeleteIcon width={24} className="fill-red-600" />
        </div>
      )}
      <div> {content}</div>
    </div>
  );
};

export default TaskCard;
