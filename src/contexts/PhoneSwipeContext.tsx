"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
  type MouseEvent,
  type DragEvent,
} from "react";

type SwipeFn = (delta: number) => void;

interface PhoneSwipeValue {
  registerSwipe: (fn: SwipeFn) => void;
  mouseHandlers: {
    onMouseDown: (e: MouseEvent) => void;
    onDragStart: (e: DragEvent) => void;
  };
  onWheel: (e: globalThis.WheelEvent) => void;
}

const PhoneSwipeContext = createContext<PhoneSwipeValue | null>(null);

export function usePhoneSwipe() {
  return useContext(PhoneSwipeContext);
}

export function PhoneSwipeProvider({ children }: { children: ReactNode }) {
  const swipeFnRef = useRef<SwipeFn | null>(null);

  const registerSwipe = useCallback((fn: SwipeFn) => {
    swipeFnRef.current = fn;
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    const startX = e.clientX;
    let dragging = false;

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!dragging && Math.abs(ev.clientX - startX) > 10) {
        dragging = true;
        window.getSelection()?.removeAllRanges();
      }
      if (dragging) {
        ev.preventDefault();
      }
    };

    const onUp = (ev: globalThis.MouseEvent) => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const dx = ev.clientX - startX;
      if (Math.abs(dx) < 50) return;
      swipeFnRef.current?.(dx < 0 ? 1 : -1);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const onDragStart = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onWheel = useCallback((e: globalThis.WheelEvent) => {
    e.preventDefault();
    wheelAccum.current += e.deltaX;

    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      wheelAccum.current = 0;
      wheelTimer.current = null;
    }, 300);

    if (Math.abs(wheelAccum.current) >= 50) {
      swipeFnRef.current?.(wheelAccum.current > 0 ? 1 : -1);
      wheelAccum.current = 0;
      if (wheelTimer.current) {
        clearTimeout(wheelTimer.current);
        wheelTimer.current = null;
      }
    }
  }, []);

  return (
    <PhoneSwipeContext.Provider
      value={{
        registerSwipe,
        mouseHandlers: { onMouseDown, onDragStart },
        onWheel,
      }}
    >
      {children}
    </PhoneSwipeContext.Provider>
  );
}
