import { AnimatePresence, motion } from "framer-motion";

interface DynamicIslandProps {
  label?: string;
}

export default function DynamicIsland({ label }: DynamicIslandProps) {
  return (
    <div
      className={`absolute left-1/2 top-[4px] flex h-[36px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black transition-[width] duration-300 ease-out ${
        label ? "w-[190px]" : "w-[120px]"
      } ${label ? "z-50" : "z-10"}`}
      aria-live={label ? "polite" : undefined}
      aria-label={label}
    >
      <AnimatePresence mode="popLayout">
        {label && (
          <motion.span
            key={label}
            className="px-4 text-center text-[11px] font-semibold leading-none text-white"
            style={{ willChange: "transform, opacity" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
