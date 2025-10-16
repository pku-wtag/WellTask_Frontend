import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { Button } from "../base-component/Button";
import { BoardList } from "./BoardList";
import { BoardNavbar } from "./BoardNavbar";
import { CreateList } from "./CreateList";
import type { Board } from "@/types/Workspace";
import { addList } from "@/redux/thunks/listThunks";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { moveCard } from "@/redux/thunks/cardThunks";

export default function Board() {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("id");

  const dispatch = useDispatch<AppDispatch>();
  const [isListModalOpen, setListModalOpen] = useState(false);

  const boardsState = useSelector((state: RootState) => state.board.boards);
  const listsState = useSelector((state: RootState) => state.list.lists);
  const cardsState = useSelector((state: RootState) => state.card.cards);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isCardDragging, setIsCardDragging] = useState(false);

  const board: Board | undefined = Object.values(boardsState)
    .flat()
    .find((b) => b.id === boardId);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Board not found.
      </div>
    );
  }

  const boardLists = boardId
    ? listsState[boardId]?.map((list) => ({
        ...list,
        cards: cardsState[list.id] || list.cards,
      })) || []
    : [];

  const handleAddList = async (name: string) => {
    if (!boardId) return;
    await dispatch(addList({ boardId, name }));
    setListModalOpen(false);
  };

  const onDragStart = () => {
    setIsCardDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsCardDragging(false);

    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (!boardId) return;

    dispatch(
      moveCard({
        boardId,
        sourceListId: source.droppableId,
        destListId: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
      })
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCardDragging) return;

    if (e.target !== scrollContainerRef.current) return;

    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <BoardNavbar name={board.name} />

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-start gap-4 py-4 overflow-x-auto overflow-y-hidden"
          style={{ cursor: isCardDragging ? "default" : "grab" }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {boardLists.map((list) => (
            <BoardList
              key={list.id}
              boardId={boardId!}
              listId={list.id}
              title={list.name}
            />
          ))}

          <div className="shrink-0 w-72">
            <Button
              type="custom"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
              onClick={() => setListModalOpen(true)}
            >
              + Add another list
            </Button>
          </div>
        </div>
      </DragDropContext>

      {boardId && isListModalOpen && (
        <CreateList
          boardId={boardId}
          isOpen={isListModalOpen}
          onClose={() => setListModalOpen(false)}
          onCreate={handleAddList}
        />
      )}
    </div>
  );
}
