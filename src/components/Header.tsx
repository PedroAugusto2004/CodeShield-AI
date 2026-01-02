import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="relative pt-12 pb-8 text-center">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="shield-pulse">
            <Shield className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient">CodeShield</span>{" "}
            <span className="text-foreground">AI</span>
          </h1>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Understand security vulnerabilities in your code with AI-powered explanations.
          Learn to write safer code without the complexity.
        </p>
      </motion.div>
    </header>
  );
}
