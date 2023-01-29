import { useLayoutEffect, useRef } from "react";

/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export function useEvent<TCallback extends (...args: any[]) => any>(
  callback: TCallback,
): TCallback {
  // Keep track of the latest callback:
  const latestRef = useRef<TCallback>(null as any);
  useLayoutEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  // using useRef instead of useCallback avoids creating and empty array on every render
  const stableRef = useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}
