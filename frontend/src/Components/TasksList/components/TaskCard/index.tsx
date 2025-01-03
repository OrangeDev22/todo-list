import { useState } from "react";
import cc from "classcat";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete.svg";
import EditValue from "../../../EditValue";

const TaskCard = ({
  id,
  content,
  isDragging,
  onDeletePressed,
  onEditTaskContent,
}: {
  id: number;
  content: string;
  isDragging: boolean;
  onDeletePressed: (id: number) => void;
  onEditTaskContent: (newValue: string) => void;
}) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (newValue: string) => {
    if (newValue !== content) onEditTaskContent(newValue);

    setIsEditing(false);
  };

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
      {!isEditing ? (
        <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
          {content}
        </div>
      ) : (
        <EditValue initialValue={content} onComplete={handleContentChange} />
      )}
    </div>
  );
};

export default TaskCard;
