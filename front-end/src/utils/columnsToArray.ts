import { ColumnsType } from "../default-data";

export const columnsToArray = (columns: ColumnsType) => {
  const arayOfColumns = Object.entries(columns).map(
    ([columnId, column]) => column
  );
  return arayOfColumns;
};
