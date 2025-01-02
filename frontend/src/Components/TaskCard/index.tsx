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
        "p-2 shadow-lg rounded-lg break-words relative",
        { "bg-indigo-700": isDragging },
        { "bg-indigo-500": !isDragging },
      ])}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      {showDeleteIcon && (
        <div
          onClick={() => onDeletePressed(boardId, taskId)}
          className="bg-white absolute rounded-full cursor-pointer -top-2 -left-3"
        >
          <DeleteIcon width={22} className="fill-red-700" />
        </div>
      )}
      <div>{content}</div>
    </div>
  );
};

export default TaskCard;
