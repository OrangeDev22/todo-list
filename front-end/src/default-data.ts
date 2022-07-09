import { v4 as uuid } from "uuid";

export const dummyItems = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
];

export const defaultColumns: ColumnsType = {
  [uuid()]: {
    name: "Requested",
    items: dummyItems,
  },
  [uuid()]: {
    name: "To do",
    items: [],
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};

export interface ColumnItem {
  id: string;
  content: string;
}

export interface ColumnsType {
  [x: string]: {
    name: string;
    items: ColumnItem[];
  };
}
