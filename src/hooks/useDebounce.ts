import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
) {
  const fnRef = useRef(fn);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        fnRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debounced;
}
