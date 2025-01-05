import { Draggable } from "react-beautiful-dnd";
import { Task } from "../../../../types";
import TaskCard from "../TaskCard";
import { useBoards } from "../../../../providers/BoardsProvider";
import axiosInstance from "../../../../axios";

type Props = {
  task: Task;
  boardId: number;
  index: number;
};

const TaskDraggable = ({ task, index, boardId }: Props) => {
  const { deleteTask, editTask } = useBoards();

  const handleDeleteTask = async () => {
    try {
      const response = await axiosInstance.delete(`/tasks/${task.id}`);

      if (response.data.record) {
        deleteTask(boardId, task.id);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (newValue: string) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${task.id}`, {
        content: newValue,
      });

      if (response.data.record) {
        editTask(newValue, task.id, boardId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

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
        >
          <TaskCard
            content={task.content}
            isDragging={snapshot.isDragging}
            onDeletePressed={handleDeleteTask}
            onEditTaskContent={handleEditTask}
          />
        </div>
      )}
    </Draggable>
  );
};

export default TaskDraggable;
