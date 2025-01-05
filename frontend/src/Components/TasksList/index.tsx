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
    <div className="rounded-md">
      <Droppable droppableId={originBoardId.toString()} type="TASK">
        {(provided, snapshot) => (
          <div
            className={twMerge(
              "min-h-1 rounded-lg h-full",
              snapshot.isDraggingOver && "bg-neutral-600"
            )}
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`group-task-${originBoardId}`}
          >
            <div
              className="overflow-y-auto overflow-x-hidden flex flex-col gap-2"
              style={{
                maxHeight: `calc(100vh - 220px)`,
              }}
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
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TasksList;
