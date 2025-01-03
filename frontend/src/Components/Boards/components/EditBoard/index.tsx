import { useState, useEffect, useRef } from "react";
import InputField from "../../../InputField";
import axiosInstance from "../../../../axios";

interface Props {
  boardId: number;
  onComplete: (newName: string) => void;
  initialValue: string;
}

const EditBoard = ({ onComplete, initialValue, boardId }: Props) => {
  const [name, setName] = useState(initialValue);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setName(initialValue);
      onComplete(initialValue);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [initialValue, onComplete]);

  return (
    <form
      ref={formRef}
      onMouseDown={(e) => e.stopPropagation()}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name || name === initialValue) return onComplete(initialValue);

        try {
          onComplete(name);
          const response = await axiosInstance.patch(`boards/${boardId}`, {
            name,
          });

          if (response.data.record) onComplete(response.data.record.name);
        } catch (error) {
          console.error("--error", error);
          onComplete(initialValue);
        }
      }}
    >
      <InputField
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        placeholder="Please Type the name of the board"
      />
    </form>
  );
};

export default EditBoard;
