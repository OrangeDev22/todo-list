import { TaskGroupType } from "../default-data";

type Droppable = {
  droppableId: string;
  index: number;
};

// export const orderMultipleGroupsTasks = (
//   source: Droppable,
//   destination: Droppable,
//   groupTasks: TaskGroupType
// ) => {
//   const sourceGroup = groupTasks[source.droppableId];
//   const destGroup = groupTasks[destination.droppableId];
//   const sourceTasks = [...sourceGroup.tasks];
//   const destTasks = [...destGroup.tasks];
//   const [removed] = sourceTasks.splice(source.index, 1);
//   destTasks.splice(destination.index, 0, removed);

//   return {
//     result: {
//       ...groupTasks,
//       [source.droppableId]: {
//         ...sourceGroup,
//         tasks: sourceTasks,
//       },
//       [destination.droppableId]: {
//         ...destGroup,
//         tasks: destTasks,
//       },
//     },
//     destTasks,
//     sourceTasks,
//   };
// };

// export const orderSingleGroupTasks = (
//   source: Droppable,
//   destination: Droppable,
//   groupTasks: TaskGroupType
// ) => {
//   const group = groupTasks[source.droppableId];
//   const copiedTasks = [...group.tasks];
//   const [removed] = copiedTasks.splice(source.index, 1);
//   copiedTasks.splice(destination.index, 0, removed);
//   return {
//     result: {
//       ...groupTasks,
//       [source.droppableId]: {
//         ...group,
//         tasks: copiedTasks,
//       },
//     },
//     copiedTasks,
//   };
// };
