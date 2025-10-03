import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
      <p className="text-muted-foreground mt-2">
        Sign in to continue to your AI assistant
      </p>
    </div>
  );
}
