import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="relative pt-8 sm:pt-12 pb-6 sm:pb-8 text-center px-2">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[200px] bg-primary/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="shield-pulse">
            <Shield className="w-9 h-9 sm:w-12 sm:h-12 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient">CodeShield</span>{" "}
            <span className="text-foreground">AI</span>
          </h1>
        </div>

        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Understand security vulnerabilities in your code with AI-powered explanations.
          Learn to write safer code without the complexity.
        </p>
      </motion.div>
    </header>
  );
}
