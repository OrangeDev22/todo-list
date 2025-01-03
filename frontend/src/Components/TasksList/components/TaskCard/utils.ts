export enum TaskMenuActions {
  DELETE_TASK = "delete_task",
  EDIT_TASK = "edit_task",
}

export const taskMenuOptions = [
  { key: TaskMenuActions.DELETE_TASK, label: "Delete" },
  { key: TaskMenuActions.EDIT_TASK, label: "Edit" },
];
