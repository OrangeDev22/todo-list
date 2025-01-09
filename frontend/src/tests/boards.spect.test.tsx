import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../state";
import { BrowserRouter } from "react-router-dom";
import Boards from "../Components/Boards";
import { useBoards } from "../providers/BoardsProvider";

jest.mock("../providers/BoardsProvider.tsx", () => ({
  useBoards: jest.fn(),
}));

describe("Signup and Signup forms test", () => {
  let container: HTMLElement;
  let mockSetBoards = jest.fn();
  let mockAddNewBoard = jest.fn();

  beforeEach(() => {
    container = document.createElement("div");

    mockSetBoards = jest.fn();
    mockAddNewBoard = jest.fn();
    (useBoards as jest.Mock).mockReturnValue({
      boards: [
        { id: 1, name: "Board 1", tasks: [] },
        { id: 2, name: "Board 2", tasks: [] },
      ],
      loading: false,
      originalBoards: [],
      selectedBoard: null,
      setBoards: mockSetBoards,
      setSelectedBoard: jest.fn(),
      addNewBoard: mockAddNewBoard,
      addNewTask: jest.fn(),
      editBoard: jest.fn(),
      removeBoard: jest.fn(),
      deleteTask: jest.fn(),
      editTask: jest.fn(),
    });
    document.body.appendChild(container);
    container = render(
      <Provider store={store}>
        <BrowserRouter>
          <Boards />
        </BrowserRouter>
      </Provider>
    ).container;
  });
});
