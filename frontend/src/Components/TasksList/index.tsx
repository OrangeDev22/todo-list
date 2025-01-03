import { BoardType, Task } from "../../types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import cc from "classcat";
import TaskCard from "./components/TaskCard";
import TaskDraggable from "./components/TaskDraggable";

type Props = {
  tasks: Task[];
  originBoardId: number;
  onDeleteClicked: (taskId: number) => void;
};

const TasksList = ({ tasks, originBoardId, onDeleteClicked }: Props) => {
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
            className={cc([
              "space-y-2 min-h-1 rounded-lg",
              { "bg-neutral-600": snapshot.isDraggingOver },
            ])}
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`group-task-${originBoardId}`}
          >
            {tasks.map((task, index) => (
              <TaskDraggable
                boardId={originBoardId}
                index={index}
                task={task}
                onDeletePressed={onDeleteClicked}
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
