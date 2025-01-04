import { Task } from "../../types";
import { Droppable } from "react-beautiful-dnd";
import TaskDraggable from "./components/TaskDraggable";
import { twMerge } from "tailwind-merge";

type Props = {
  tasks: Task[];
  originBoardId: number;
};

const TasksList = ({ tasks, originBoardId }: Props) => {
  return (
    <div
      className="flex-grow overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-md"
      style={{
        maxHeight: `calc(100vh - 220px)`,
      }}
    >
      <Droppable droppableId={originBoardId.toString()} type="TASK">
        {(provided, snapshot) => (
          <div
            className={twMerge(
              "space-y-2 min-h-1 rounded-lg",
              snapshot.isDraggingOver && "bg-neutral-600"
            )}
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`group-task-${originBoardId}`}
          >
            {tasks.map((task, index) => (
              <TaskDraggable
                boardId={originBoardId}
                index={index}
                task={task}
                key={task.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TasksList;
