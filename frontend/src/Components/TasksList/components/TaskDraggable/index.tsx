import { Draggable } from "react-beautiful-dnd";
import { Task } from "../../../../types";
import TaskCard from "../TaskCard";

type Props = {
  task: Task;
  index: number;
  onDeletePressed: (id: number) => void;
  boardId: number;
};

const TaskDraggable = ({ task, index, onDeletePressed, boardId }: Props) => {
  return (
    <Draggable
      key={task.id.toString()}
      draggableId={task.id.toString()}
      index={task.order}
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
          />
        </div>
      )}
    </Draggable>
  );
};

export default TaskDraggable;
