import { Draggable } from "react-beautiful-dnd";
import { BoardType, Task } from "../../../../types";
import TasksList from "../../../TasksList";
import NewTaskCard from "../../../NewTaskCard";
import { deleteTask } from "../../../../utils/tasksUtils";

interface Props {
  board: BoardType;
  selectedGroup: number | null;
  onSelectGroup: (boardId: number | null) => void;
  onAddTask: (task: Task, boardId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

const Board = ({
  board,
  selectedGroup,
  onSelectGroup,
  onAddTask,
  onDeleteTask,
}: Props) => {
  return (
    <Draggable
      key={`board-id-${board.id}`}
      draggableId={`board-id-${board.id}`}
      index={board.order}
    >
      {(provided) => {
        return (
          <div
            className="m-2 bg-neutral-800 rounded-xl overflow-hidden min-w-[272px] flex flex-col p-2 text-gray-300 space-y-3"
            key={board.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <h2 className="mx-2 mt-2">{board.name}</h2>

            <TasksList
              tasks={board.tasks}
              originBoardId={board.id}
              onDeleteClicked={onDeleteTask}
            />
            {selectedGroup === board.id && (
              <NewTaskCard
                boardId={board.id}
                onCancel={() => {
                  onSelectGroup(null);
                }}
                onSubmitCompleted={onAddTask}
                tasks={board.tasks}
              />
            )}

            <button
              className="hover:bg-neutral-700 rounded-md"
              onClick={() => onSelectGroup(board.id)}
            >
              <span className="font-bold mr-2 self-start">+</span>
              Add a Task
            </button>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Board;
