export function exists<T>(value?: T): value is T {
  return !!value;
}
