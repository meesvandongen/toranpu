import { createContext, MutableRefObject } from "react";
import { Data, DataRef, UniqueIdentifier } from "./dnd-types";

export interface ClientRect {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Collision {
  id: UniqueIdentifier;
  data?: Data;
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Translate = Coordinates;

export interface Active {
  id: UniqueIdentifier;
  data: DataRef;
  rect: MutableRefObject<{
    initial: ClientRect | null;
    translated: ClientRect | null;
  }>;
}

export interface Over {
  id: UniqueIdentifier;
  rect: ClientRect;
  disabled: boolean;
  data: DataRef;
}

interface DragEvent {
  activatorEvent: Event;
  active: Active;
  collisions: Collision[] | null;
  delta: Translate;
  over: Over | null;
}

export interface DragStartEvent extends Pick<DragEvent, "active"> {}

export interface DragMoveEvent extends DragEvent {}

export interface DragOverEvent extends DragMoveEvent {}

export interface DragEndEvent extends DragEvent {}

export interface DragCancelEvent extends DragEndEvent {}

interface DndProps {
  children?: React.ReactNode;
  /**
   * Fires when a drag event that meets the activation constraints for that
   * sensor happens, along with the unique identifier of the draggable element
   * that was picked up.
   */
  onDragStart?(event: DragStartEvent): void;
  /**
   * Fires anytime as the draggable item is moved. Depending on the activated
   * sensor, this could for example be as the Pointer is moved or the Keyboard
   * movement keys are pressed.
   */
  onDragMove?(event: DragMoveEvent): void;
  /**
   * Fires when a draggable item is moved over a droppable container, along with
   * the unique identifier of that droppable container.
   */
  onDragOver?(event: DragOverEvent): void;
  /**
   * Fires after a draggable item is dropped.
   *
   * This event contains information about the active draggable id along with
   * information on whether the draggable item was dropped over.
   *
   * If there are no collisions detected when the draggable item is dropped, the
   * over property will be null. If a collision is detected, the over property
   * will contain the id of the droppable over which it was dropped.
   *
   * > It's important to understand that the onDragEnd event does not move
   * > draggable items into droppable containers.
   * >
   * > Rather, it provides information about which draggable item was dropped
   * > and whether it was over a droppable container when it was dropped.
   * >
   * > It is up to the consumer of DndContext to decide what to do with that
   * > information and how to react to it, for example, by updating (or not) its
   * > internal state in response to the event so that the items are
   * > declaratively rendered in a different parent droppable.
   */
  onDragEnd?(event: DragEndEvent): void;
  /**
   * Fires if a drag operation is cancelled, for example, if the user presses
   * escape while dragging a draggable item.
   */
  onDragCancel?(): void;
}

export const DndContext = createContext({});

export const DndProvider = ({ children, ...props }: DndProps) => {
  return <DndContext.Provider value={props}>{children}</DndContext.Provider>;
};
