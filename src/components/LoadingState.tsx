import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="result-card p-12"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          {/* Animated shield */}
          <div className="relative">
            <Shield className="w-16 h-16 text-primary shield-pulse" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
          </div>
          
          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scanning-line" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Analyzing Your Code</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Scanning for security vulnerabilities and generating educational insights...
        </p>
        
        {/* Progress dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
