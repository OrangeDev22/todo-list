import { useState } from "react";
import cc from "classcat";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete.svg";

const TaskCard = ({
  id,
  content,
  isDragging,
  onDeletePressed,
}: {
  id: number;
  content: string;
  isDragging: boolean;
  onDeletePressed: (id: number) => void;
}) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  return (
    <div
      className={cc([
        "p-2 shadow-lg rounded-lg break-words relative max-w-[248px]",
        { "bg-indigo-700": isDragging },
        { "bg-indigo-500": !isDragging },
      ])}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      {showDeleteIcon && (
        <div
          onClick={() => onDeletePressed(id)}
          className="bg-white absolute rounded-full cursor-pointer -top-2 left-0"
        >
          <DeleteIcon width={22} className="fill-red-700" />
        </div>
      )}
      <div>{content}</div>
    </div>
  );
};

export default TaskCard;
