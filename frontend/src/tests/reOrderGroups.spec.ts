import { defaultGroupsTask } from "../default-data";
import {
  orderMultipleGroupsTasks,
  orderSingleGroupTasks,
} from "../utils/orderTasks";

describe("Testing re ordering of tasks groups", () => {
  it("re ordering single group's tasks", () => {
    const expectedResult = [
      { id: "9", content: "Fifth task" },
      { id: "5", content: "First task" },
      { id: "6", content: "Second task" },
      { id: "7", content: "Third task" },
      { id: "8", content: "Fourth task" },
    ];
    const newTasks = orderSingleGroupTasks(
      { droppableId: "1", index: 4 },
      { droppableId: "1", index: 0 },
      defaultGroupsTask
    ).result["1"].tasks;
    expect(newTasks).toEqual(expectedResult);
  });

  it("re ordering two group's tasks", () => {
    const expectedResult = {
      ["1"]: {
        name: "To do",
        tasks: [
          { id: "5", content: "First task" },
          { id: "6", content: "Second task" },
          { id: "7", content: "Third task" },
          { id: "8", content: "Fourth task" },
        ],
      },
      ["2"]: {
        name: "In Progress",
        tasks: [],
      },
      ["3"]: {
        name: "Done",
        tasks: [{ id: "9", content: "Fifth task" }],
      },
    };
    const orderGroups = orderMultipleGroupsTasks(
      { droppableId: "1", index: 4 },
      { droppableId: "3", index: 0 },
      defaultGroupsTask
    ).result;

    expect(orderGroups).toEqual(expectedResult);
  });
});
