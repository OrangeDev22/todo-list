import { BoardType, Task } from "../../types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "../TaskCard";
import cc from "classcat";

type Props = {
  boards: BoardType[];
  originBoardId: number;
  tasks: Task[];
  setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
};

const TasksList = ({ boards, originBoardId, tasks, setBoards }: Props) => {
  return (
    <div>
      <Droppable
        droppableId={originBoardId.toString()}
        key={originBoardId}
        type="ROW"
      >
        {(provided, snapshot) => {
          return (
            <div
              className={cc([
                "p-1 w-64 min-h-32",
                { "bg-sky-200": snapshot.isDraggingOver },
              ])}
              {...provided.droppableProps}
              ref={provided.innerRef}
              data-testid={`group-task-${originBoardId}`}
            >
              {tasks.map((task, index) => {
                return (
                  <Draggable
                    key={task.id.toString()}
                    draggableId={task.id.toString()}
                    index={task.order}
                  >
                    {(provided, snapshot) => {
                      return (
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

                              const board = boards[boardIndex];

                              // Find and remove the task
                              board.tasks = board.tasks.filter(
                                (task) => task.id !== taskId
                              );

                              // Update the order property of remaining tasks
                              board.tasks.forEach((task, index) => {
                                task.order = index;
                              });

                              // Update state
                              setBoards([...boards]);
                            }}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default TasksList;
