import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { handleDragEnd } from "./utils";
import NewBoardCard from "../NewBoardCard";
import Board from "./components/Board";
import useScroll from "../../hooks/useScroll";
import { useBoards } from "../../providers/BoardsProvider";
import Loading from "../Loading";

const Boards = () => {
  const { boards, loading, originalBoards, setBoards } = useBoards();

  const {
    isScrollbarVisible,
    scrollContainer,
    restoreScrollContainerPointer,
    handleScroll,
  } = useScroll();

  const onDragStart = () => {
    if (scrollContainer.current) {
      scrollContainer.current.style.pointerEvents = "none";
    }
  };

  if (loading)
    return (
      <div className="mx-auto flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div
      className={`overflow-x-auto h-full ${
        isScrollbarVisible ? "cursor-grab" : ""
      }`}
      ref={scrollContainer}
      onMouseDown={(e) => e.preventDefault()}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleScroll(e);
      }}
    >
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={(result) =>
          handleDragEnd(
            result,
            boards,
            originalBoards,
            setBoards,
            restoreScrollContainerPointer
          )
        }
      >
        <Droppable droppableId="board" type="BOARD" direction="horizontal">
          {(provided) => (
            <div
              className="inline-flex items-start min-h-lvh"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards.map((board, index) => {
                return (
                  <Board
                    key={`droppable-board-${board.id}`}
                    board={board}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}

              <NewBoardCard />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Boards;
