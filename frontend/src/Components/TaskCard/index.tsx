import { useState } from "react";
import cc from "classcat";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";

const TaskCard = ({
  content,
  isDragging,
  onDeletePressed,
}: {
  content: string;
  isDragging: boolean;
  onDeletePressed: () => void;
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
          onClick={() => onDeletePressed()}
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
