import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  ColumnItem,
  ColumnsType,
  defaultColumns as dummyColumns,
  dummyItems,
} from "../../default-data";
import cc from "classcat";
import withContainer from "../../hoc/withContainer";
import InputField from "../../Components/InputField";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { State } from "../../state";
import { columnsToArray } from "../../utils/columnsToArray";
import { arrayToColumns } from "../../utils/arrayToColumns";
import Button from "../../Components/Button";

const onDragEnd = async (
  result: any,
  columns: ColumnsType,
  setColumns: any,
  token: string
) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
    await axios.post(
      "task/update_task_group",
      {
        sourceId: +source.droppableId,
        destinationId: +destination.droppableId,
        newTasksSource: sourceItems,
        newTasksDestionation: destItems,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
    const body = {
      taskGroupId: +source.droppableId,
      tasks: copiedItems,
    };
    console.log("--body", body);
    await axios.post("task/set_tasks", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

function DashBoard() {
  const [columns, setColumns] = useState<ColumnsType>({});
  const [loading, setLoading] = useState(true);
  const [creatingDefaultData, setCreatingDefaultData] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const user = useSelector((state: State) => state.user);
  const header = {
    Authorization: `Bearer ${user?.token}`,
  };

  const createDefaultTasks = async () => {
    const defaultColumns = columnsToArray(dummyColumns);
    let newColumns = {};
    for (let index = 0; index < defaultColumns.length; index++) {
      const { name } = defaultColumns[index];
      await axios
        .post(
          "task/task_group",
          { name, userId: user?.id },
          { headers: header }
        )
        .then((response) => {
          const newColumn = response.data;
          newColumns = {
            ...newColumns,
            [newColumn.id]: { name: newColumn.name, items: newColumn.tasks },
          };
        });
    }
    setColumns(newColumns);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/task/get_group_tasks", {
          headers: header,
        })
        .then((response) => {
          if (response.data.length === 0) {
            setCreatingDefaultData(true);
            createDefaultTasks();
          } else {
            setColumns(arrayToColumns(response.data));
            setLoading(false);
          }
        });
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div>Loading...</div>
        {creatingDefaultData && <div>Creating Dashboard...</div>}
      </>
    );
  }

  return (
    <div className="flex h-full">
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(result, columns, setColumns, user?.token || "")
        }
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div key={columnId}>
              <h2>{column.name}</h2>
              <div className="m-2 bg-neutral-300 rounded-md overflow-hidden flex flex-col">
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        className={cc([
                          "p-1 w-64 min-h-32",
                          { "bg-sky-200": snapshot.isDraggingOver },
                        ])}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
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
                                  >
                                    <TaskCard
                                      id={item.id}
                                      content={item.content}
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
                {selectedColumn && selectedColumn === columnId && (
                  <NewTaskCard
                    columnId={columnId}
                    onCancel={() => {
                      setSelectedColumn(null);
                    }}
                    onSubmitCompleted={(newTask, columnId) => {
                      setColumns((prev) => {
                        let columnsCopy = prev;
                        columnsCopy[columnId].items = [
                          ...columnsCopy[columnId].items,
                          newTask,
                        ];
                        return columnsCopy;
                      });
                      setSelectedColumn(null);
                    }}
                    tasks={column.items}
                  />
                )}
                {!selectedColumn && (
                  <button
                    className="text-neutral-700 w-full hover:bg-neutral-400"
                    onClick={() => setSelectedColumn(columnId)}
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
  columnId,
  onCancel,
  onSubmitCompleted,
  tasks,
}: {
  columnId: number | string;
  onCancel: () => void;
  onSubmitCompleted: (newTasks: ColumnItem, columnId: number) => void;
  tasks: ColumnItem[];
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
          taskGroupId: +columnId,
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
                +columnId
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
          placeHolder="PLease Type the content of the task"
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

export default withContainer(DashBoard, { leftAndRight: false });
