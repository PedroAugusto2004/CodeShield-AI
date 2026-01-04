import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Play, Loader2, RotateCcw } from "lucide-react";
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
  onReset?: () => void;
  isLoading: boolean;
}

const PLACEHOLDER_CODE = `// Example (JavaScript/TypeScript)
function greetUser(req, res) {
  const name = req.query.name;
  res.send("Hello " + name);
}
`;

export function CodeInput({ onAnalyze, onReset, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code, language);
    }
  };

  const handleReset = () => {
    setCode("");
    if (onReset) {
      onReset();
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
        <p className="text-muted-foreground text-sm">
          Paste a short code snippet to receive an educational security review.
        </p>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={PLACEHOLDER_CODE}
          className="code-editor min-h-[180px] sm:min-h-[250px] resize-y border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/50 text-base"
        />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Language:</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="flex-1 sm:flex-none sm:w-[180px] bg-secondary border-border/50 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="swift">Swift</SelectItem>
                <SelectItem value="kotlin">Kotlin</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || (!code && !onReset)}
              className="border-border/50 hover:bg-secondary h-11 w-full sm:w-auto order-2 sm:order-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>

            <Button
              onClick={handleAnalyze}
              disabled={!code.trim() || isLoading}
              className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-11 w-full sm:w-auto order-1 sm:order-2"
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
      </div>
    </motion.div>
  );
}
