"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";

type SwipeFn = (delta: number) => void;

interface PhoneSwipeValue {
  registerSwipe: (fn: SwipeFn) => void;
  mouseHandlers: {
    onMouseDown: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

const PhoneSwipeContext = createContext<PhoneSwipeValue | null>(null);

export function usePhoneSwipe() {
  return useContext(PhoneSwipeContext);
}

export function PhoneSwipeProvider({ children }: { children: ReactNode }) {
  const swipeFnRef = useRef<SwipeFn | null>(null);
  const dragRef = useRef<{ startX: number } | null>(null);

  const registerSwipe = useCallback((fn: SwipeFn) => {
    swipeFnRef.current = fn;
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    dragRef.current = { startX: e.clientX };
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current = null;
    if (Math.abs(dx) < 50) return;
    swipeFnRef.current?.(dx < 0 ? 1 : -1);
  }, []);

  const onMouseLeave = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <PhoneSwipeContext.Provider
      value={{
        registerSwipe,
        mouseHandlers: { onMouseDown, onMouseUp, onMouseLeave },
      }}
    >
      {children}
    </PhoneSwipeContext.Provider>
  );
}
