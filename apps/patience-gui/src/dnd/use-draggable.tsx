import { useLayoutEffect } from "react";
import { Data, UniqueIdentifier } from "./dnd-types";

export interface UseDraggableArguments {
  id: UniqueIdentifier;
  data?: Data;
  disabled?: boolean;
  attributes?: {
    role?: string;
    roleDescription?: string;
    tabIndex?: number;
  };
}

export function useDraggable({
  id,
  data,
  disabled = false,
  attributes,
}: UseDraggableArguments) {
  const key = useUniqueId(ID_PREFIX);
  const {
    activators,
    activatorEvent,
    active,
    activeNodeRect,
    ariaDescribedById,
    draggableNodes,
    over,
  } = useContext(InternalContext);
  const {role = defaultRole, roleDescription = 'draggable', tabIndex = 0} =
    attributes ?? {};
  const isDragging = active?.id === id;
  const transform: Transform | null = useContext(
    isDragging ? ActiveDraggableContext : NullContext
  );
  const [node, setNodeRef] = useNodeRef();
  const [activatorNode, setActivatorNodeRef] = useNodeRef();
  const listeners = useSyntheticListeners(activators, id);
  const dataRef = useLatestValue(data);

  /**
   * Register the draggable node with the context
   */
  useLayoutEffect(
    () => {
      draggableNodes.set(id, {id, key, node, activatorNode, data: dataRef});

      return () => {
        const node = draggableNodes.get(id);

        if (node && node.key === key) {
          draggableNodes.delete(id);
        }
      };
    },
    [draggableNodes, id]
  );

  const memoizedAttributes: DraggableAttributes = useMemo(
    () => ({
      role,
      tabIndex,
      'aria-disabled': disabled,
      'aria-pressed': isDragging && role === defaultRole ? true : undefined,
      'aria-roledescription': roleDescription,
      'aria-describedby': ariaDescribedById.draggable,
    }),
    [
      disabled,
      role,
      tabIndex,
      isDragging,
      roleDescription,
      ariaDescribedById.draggable,
    ]
  );

  return {
    active,
    activatorEvent,
    activeNodeRect,
    attributes: memoizedAttributes,
    isDragging,
    listeners: disabled ? undefined : listeners,
    node,
    over,
    setNodeRef,
    setActivatorNodeRef,
    transform,
  };
}
