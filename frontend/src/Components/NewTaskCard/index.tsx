import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import cc from "classcat";
import InputField from "../InputField/index";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { State } from "../../state";
import Button from "../Button/index";
// import {
//   orderMultipleGroupsTasks,
//   orderSingleGroupTasks,
// } from "../../utils/orderTasks";
import Container from "../Container/index";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import { Task } from "../../types";

const NewTaskCard = ({
  boardId,
  onCancel,
  onSubmitCompleted,
  tasks,
}: {
  boardId: number;
  onCancel: () => void;
  onSubmitCompleted: (newTasks: Task, boardId: number) => void;
  tasks: Task[];
}) => {
  const user = useSelector((state: State) => state.user);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  console.log("--new task content", content);
  return (
    <form
      className="m-1 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const newTask = {
          content,
          id: Date.now(),
          order: tasks.length,
          boardId,
        };
        onSubmitCompleted(newTask, +boardId);
        // const body = {
        //   taskGroupId: +boardId,
        //   tasks: [...tasks, newTask],
        // };
        // await axios
        //   .post("task/set_tasks", body, {
        //     headers: {
        //       Authorization: `Bearer ${user?.token}`,
        //     },
        //   })
        //   .then((response) => {
        //     response.data &&
        //       onSubmitCompleted(
        //         {
        //           id: newTask.id,
        //           content: newTask.content,
        //           order: tasks.length,
        //         },
        //         +boardId
        //       );
        //     setSubmitting(false);
        //   });
      }}
    >
      <div className="p-4 min-h-14 shadow-lg rounded-lg bg-sky-500">
        <InputField
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
          placeholder="PLease Type the content of the task"
        />
      </div>
      <div className="w-full flex">
        <Button onClick={() => setSubmitting(true)}>
          {submitting ? "Loading..." : "Add Task"}
        </Button>
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

export default NewTaskCard;
