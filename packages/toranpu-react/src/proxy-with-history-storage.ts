import type { INTERNAL_Snapshot as Snapshot } from "valtio/vanilla";
import { proxy, ref, snapshot, subscribe } from "valtio/vanilla";

type SnapshotOrUndefined<T> = Snapshot<T> | undefined;
type Snapshots<T> = Snapshot<T>[];

const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

const deepClone = <T,>(obj: T): T => {
  if (!isObject(obj)) {
    return obj;
  }
  const baseObject: T = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  Reflect.ownKeys(obj).forEach((key) => {
    baseObject[key as keyof T] = deepClone(obj[key as keyof T]);
  });
  return baseObject;
};

export interface History<V> {
  wip: SnapshotOrUndefined<V>;
  snapshots: Snapshots<V>;
  index: number;
}

export function proxyWithHistory<V>(
  initialValue: V,
  initialHistory: History<V> = {
    wip: undefined as SnapshotOrUndefined<V>,
    snapshots: [] as Snapshots<V>,
    index: -1,
  },
  skipSubscribe = false,
) {
  const proxyObject = proxy({
    value: initialValue,
    history: ref(initialHistory),
    canUndo: () => proxyObject.history.index > 0,
    undo: () => {
      if (proxyObject.canUndo()) {
        proxyObject.value = (proxyObject.history.wip = deepClone(
          proxyObject.history.snapshots[--proxyObject.history.index],
        ) as Snapshot<V>) as V;
      }
    },
    canRedo: () =>
      proxyObject.history.index < proxyObject.history.snapshots.length - 1,
    redo: () => {
      if (proxyObject.canRedo()) {
        proxyObject.value = (proxyObject.history.wip = deepClone(
          proxyObject.history.snapshots[++proxyObject.history.index],
        ) as Snapshot<V>) as V;
      }
    },
    saveHistory: () => {
      proxyObject.history.snapshots.splice(proxyObject.history.index + 1);
      proxyObject.history.snapshots.push(snapshot(proxyObject).value);
      ++proxyObject.history.index;
    },
    subscribe: () =>
      subscribe(proxyObject, (ops) => {
        if (
          ops.every(
            (op) =>
              op[1][0] === "value" &&
              (op[0] !== "set" || op[2] !== proxyObject.history.wip),
          )
        ) {
          proxyObject.saveHistory();
        }
      }),
  });
  if (!initialHistory) {
    proxyObject.saveHistory();
  }
  if (!skipSubscribe) {
    proxyObject.subscribe();
  }
  return proxyObject;
}
