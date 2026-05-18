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
      <AnimatePresence mode="wait">
        {label && (
          <motion.span
            key={label}
            className="px-4 text-center text-[11px] font-semibold leading-none text-white"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
