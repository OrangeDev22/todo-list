import React, { useState } from "react";
import InputField from "../InputField/index";
import Button from "../Button/index";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Task } from "../../types";
import axiosInstance from "../../axios";

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
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="mx-1 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          const response = await axiosInstance.post("/tasks", {
            boardId,
            content,
            order: tasks.length,
          });

          if (response.data.record) {
            const newTask = response.data.record;
            onSubmitCompleted(newTask, +boardId);
          }
          setSubmitting(false);
        } catch (error) {
          console.error("--error", error);
          setSubmitting(false);
        }
      }}
    >
      <div
        className="shadow-lg rounded-lg bg-indigo-500"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <InputField
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
          placeholder="Please Type the content of the task"
        />
      </div>
      <div className="w-full flex">
        <Button onClick={() => setSubmitting(true)} size="sm" className="!px-3">
          {submitting ? "Loading..." : "Add Task"}
        </Button>
        <button
          className="font-bold ml-auto p-3 text-neutral-600"
          onClick={() => onCancel()}
          type="button"
        >
          <XMarkIcon width={24} color="white" />
        </button>
      </div>
    </form>
  );
};

export default NewTaskCard;
