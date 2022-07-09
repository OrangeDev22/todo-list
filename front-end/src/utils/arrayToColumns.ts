import { ColumnItem, ColumnsType } from "../default-data";

type ColumnFromDb = {
  id: number;
  name: string;
  tasks: ColumnItem;
};

export const arrayToColumns = (array: ColumnFromDb[]): ColumnsType => {
  let newColumns = {};
  array.forEach((column) => {
    const { id, name, tasks } = column;
    newColumns = { ...newColumns, [id]: { name, items: tasks } };
  });
  return newColumns;
};
