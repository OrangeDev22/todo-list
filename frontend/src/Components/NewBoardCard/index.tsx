import React, { useState } from "react";
import InputField from "../InputField/index";
import Button from "../Button/index";

import { BoardType, Task } from "../../types";
import axiosInstance from "../../axios";
import { XMarkIcon } from "@heroicons/react/24/solid";

const NewBoardCard = ({
  boardsLength,
  onSubmitCompleted,
}: {
  boardsLength: number;
  onSubmitCompleted: (newBoard: BoardType) => void;
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const closeForm = () => {
    setName("");
    setIsFormOpen(false);
  };

  if (!isFormOpen) {
    return (
      <div className="m-2 bg-neutral-800 bg-opacity-50 hover:bg-opacity-70 rounded-xl min-w-[272px] py-2 px-4 text-gray-300">
        <button className="rounded-md" onClick={() => setIsFormOpen(true)}>
          <span className="font-bold mr-2 self-start">+</span>
          Add another board
        </button>
      </div>
    );
  }

  return (
    <form
      className="mx-1 space-y-2 m-2 bg-neutral-800 rounded-xl min-w-[272px] p-2 text-gray-300"
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          const response = await axiosInstance.post("/boards", {
            name,
            order: boardsLength,
          });
          if (response.data.record) {
            const newBoard = response.data.record;
            onSubmitCompleted(newBoard);
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
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="Please Type the name of the board"
        />
      </div>
      <div className="w-full flex">
        <Button onClick={() => setSubmitting(true)} size="sm" className="!px-3">
          {submitting ? "Loading..." : "Add Board"}
        </Button>
        <button
          className="font-bold ml-auto p-3 text-neutral-600"
          onClick={() => closeForm()}
          type="button"
        >
          <XMarkIcon width={24} color="white" />
        </button>
      </div>
    </form>
  );
};

export default NewBoardCard;
