import { BoardType, Task } from "../../types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "../TaskCard";
import cc from "classcat";
import axiosInstance from "../../axios";

type Props = {
  boards: BoardType[];
  originBoardId: number;
  tasks: Task[];
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
};

const TasksList = ({ boards, originBoardId, tasks, setBoards }: Props) => {
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
              "space-y-2 min-h-1",
              { "bg-neutral-600": snapshot.isDraggingOver },
            ])}
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`group-task-${originBoardId}`}
          >
            {tasks.map((task, index) => (
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
                      boardId={originBoardId}
                      taskId={task.id}
                      onDeletePressed={async (boardId, taskId) => {
                        const boardIndex = boards.findIndex(
                          (board) => originBoardId === board.id
                        );

                        if (boardIndex === -1) {
                          console.error("Board not found");
                          return;
                        }

                        await axiosInstance
                          .delete(`/tasks/${taskId}`)
                          .then(() => {
                            const board = boards[boardIndex];

                            board.tasks = board.tasks.filter(
                              (task) => task.id !== taskId
                            );

                            board.tasks.forEach((task, index) => {
                              task.order = index;
                            });

                            setBoards([...boards]);
                          })
                          .catch((error) => console.error(error));
                      }}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TasksList;
