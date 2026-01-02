import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER_CODE = `// Paste your code here to analyze for security issues
// Example (JavaScript):
const password = "admin123";
const query = "SELECT * FROM users WHERE id = " + userId;
`;

export function CodeInput({ onAnalyze, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code, language);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="result-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Code Input</h2>
      </div>

      <div className="space-y-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={PLACEHOLDER_CODE}
          className="code-editor min-h-[250px] resize-y border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/50"
        />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Language:</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[160px] bg-secondary border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!code.trim() || isLoading}
            className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
