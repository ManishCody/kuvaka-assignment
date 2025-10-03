"use client";

import { motion } from "framer-motion";

export default function MessageSkeleton({
  align = "left" as "left" | "right",
}) {
  const isRight = align === "right";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={(isRight ? "ml-auto" : "mr-auto") + " w-64 max-w-[70%]"}
    >
      <div
        className={
          (isRight ? "bg-primary/20" : "bg-muted") +
          " h-16 rounded-2xl animate-pulse"
        }
      />
      <div className="h-3 w-16 mt-2 rounded bg-muted animate-pulse" />
    </motion.div>
  );
}
