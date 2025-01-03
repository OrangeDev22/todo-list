import { Draggable } from "react-beautiful-dnd";
import { Task } from "../../../../types";
import TaskCard from "../TaskCard";

type Props = {
  task: Task;
  onDeletePressed: (id: number) => void;
  boardId: number;
  index: number;
};

const TaskDraggable = ({ task, index, onDeletePressed, boardId }: Props) => {
  return (
    <Draggable
      key={task.id.toString()}
      draggableId={task.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
          data-testid={`task-${task.id}`}
          className="my-3"
        >
          <TaskCard
            content={task.content}
            isDragging={snapshot.isDragging}
            id={task.id}
            onDeletePressed={onDeletePressed}
            onEditTaskContent={() => {}}
          />
        </div>
      )}
    </Draggable>
  );
};

export default TaskDraggable;
