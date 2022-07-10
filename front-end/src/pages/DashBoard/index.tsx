import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Task, TaskGroupType } from "../../default-data";
import cc from "classcat";
import InputField from "../../Components/InputField";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { State } from "../../state";
import Button from "../../Components/Button";
import {
  orderMultipleGroupsTasks,
  orderSingleGroupTasks,
} from "../../utils/orderTasks";

type Props = {
  initialTaskGroups: TaskGroupType;
};

function DashBoard({ initialTaskGroups }: Props) {
  const [groupTasks, setGroupTasks] =
    useState<TaskGroupType>(initialTaskGroups);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const user = useSelector((state: State) => state.user);
  const onDragEnd = async (
    result: any,
    groupTasks: TaskGroupType,
    setGroupTasks: React.Dispatch<React.SetStateAction<TaskGroupType>>,
    token: string
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const orderedGroups = orderMultipleGroupsTasks(
        source,
        destination,
        groupTasks
      );
      setGroupTasks(orderedGroups.result);
      await axios.post(
        "task/update_task_group",
        {
          sourceId: +source.droppableId,
          destinationId: +destination.droppableId,
          newTasksSource: orderedGroups.sourceTasks,
          newTasksDestionation: orderedGroups.destTasks,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      const orderedGroups = orderSingleGroupTasks(
        source,
        destination,
        groupTasks
      );
      setGroupTasks(orderedGroups.result);
      const body = {
        taskGroupId: +source.droppableId,
        tasks: orderedGroups.copiedTasks,
      };
      await axios.post("task/set_tasks", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };
  return (
    <div className="flex h-full" data-testid="root-container">
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(result, groupTasks, setGroupTasks, user?.token || "")
        }
      >
        {Object.entries(groupTasks).map(([groupId, group]) => {
          return (
            <div key={groupId}>
              <h2>{group.name}</h2>
              <div className="m-2 bg-neutral-300 rounded-md overflow-hidden flex flex-col">
                <Droppable droppableId={groupId} key={groupId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        className={cc([
                          "p-1 w-64 min-h-32",
                          { "bg-sky-200": snapshot.isDraggingOver },
                        ])}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        data-testid={`group-task-${groupId}`}
                      >
                        {group.tasks.map((task, index) => {
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
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
                                      id={task.id}
                                      content={task.content}
                                      isDragging={snapshot.isDragging}
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
                {selectedGroup && selectedGroup === groupId && (
                  <NewTaskCard
                    groupId={groupId}
                    onCancel={() => {
                      setSelectedGroup(null);
                    }}
                    onSubmitCompleted={(newTask, groupId) => {
                      setGroupTasks((prev) => {
                        let groupCopy = prev;
                        groupCopy[groupId].tasks = [
                          ...groupCopy[groupId].tasks,
                          newTask,
                        ];
                        return groupCopy;
                      });
                      setSelectedGroup(null);
                    }}
                    tasks={group.tasks}
                  />
                )}
                {!selectedGroup && (
                  <button
                    className="text-neutral-700 w-full hover:bg-neutral-400"
                    onClick={() => setSelectedGroup(groupId)}
                  >
                    <span className="font-bold mr-2">+</span>Add a Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

const NewTaskCard = ({
  groupId,
  onCancel,
  onSubmitCompleted,
  tasks,
}: {
  groupId: number | string;
  onCancel: () => void;
  onSubmitCompleted: (newTasks: Task, groupId: number) => void;
  tasks: Task[];
}) => {
  const user = useSelector((state: State) => state.user);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="m-1 space-y-2"
      onSubmit={(e) => {
        console.log("in submit");
        e.preventDefault();
        setSubmitting(true);
        const newTask = { content, id: Date.now().toString() };
        const body = {
          taskGroupId: +groupId,
          tasks: [...tasks, newTask],
        };
        axios
          .post("task/set_tasks", body, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          })
          .then((response) => {
            response.data &&
              onSubmitCompleted(
                { id: newTask.id, content: newTask.content },
                +groupId
              );
          });
        setSubmitting(false);
      }}
    >
      <div className="p-4 min-h-14 shadow-lg rounded-lg bg-sky-500">
        <InputField
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
          className="text-xs"
          placeholder="PLease Type the content of the task"
        />
      </div>
      <div className="w-full flex">
        <Button>{submitting ? "Loading..." : "Add Task"}</Button>
        <button
          className="font-bold ml-auto p-3 text-neutral-600"
          onClick={() => onCancel()}
          type="button"
        >
          X
        </button>
      </div>
    </form>
  );
};

const TaskCard = ({
  id,
  content,
  isDragging,
}: {
  id: string | number;
  content: string;
  isDragging: boolean;
}) => {
  return (
    <div
      className={cc([
        "mb-2 p-4 min-h-14 shadow-lg rounded-lg break-words",
        { "bg-sky-700": isDragging },
        { "bg-sky-500": !isDragging },
      ])}
    >
      {content}
    </div>
  );
};

export default DashBoard;
