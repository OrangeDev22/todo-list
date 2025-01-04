import { render, screen } from "@testing-library/react";
// import DashBoard from "../Components/DashBoard";
import { Provider } from "react-redux";
// import { store } from "../state/index";
// import { defaultGroupsTask } from "../default-data";

describe("DashBoard component test", () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // render(
    //   <Provider store={store}>
    //     <></>
    //     {/* <DashBoard initialTaskGroups={defaultGroupsTask} /> */}
    //   </Provider>
    // );
  });
  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });
  it("Renders the Dashboard component correctly", () => {
    expect(screen.getByTestId("root-container")).toBeInTheDocument();
    // Object.entries(defaultGroupsTask).forEach(([groupId, group]) => {
    //   expect(screen.getByTestId(`group-task-${groupId}`)).toBeInTheDocument();
    //   group.tasks.map((task) => {
    //     expect(screen.getByTestId(`task-${task.id}`)).toBeInTheDocument();
    //   });
    // });
  });
});
