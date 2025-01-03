import { useState, useEffect, useRef } from "react";
import InputField from "../InputField";
import axiosInstance from "../../axios";

interface Props {
  onComplete: (newName: string) => void;
  initialValue: string;
}

const EditValue = ({ onComplete, initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setValue(initialValue);
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
        if (!value || value === initialValue) return onComplete(initialValue);

        onComplete(value);
        // try {
        //   onComplete(value);
        //   const response = await axiosInstance.patch(`boards/${boardId}`, {
        //     value,
        //   });

        //   if (response.data.record) onComplete(response.data.record.value);
        // } catch (error) {
        //   console.error("--error", error);
        //   onComplete(initialValue);
        // }
      }}
    >
      <InputField
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        placeholder="Please Type the value of the board"
      />
    </form>
  );
};

export default EditValue;
