import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { CodeInput } from "@/components/CodeInput";
import { AnalysisResults, AnalysisResult } from "@/components/AnalysisResults";
import { LoadingState } from "@/components/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { checkLanguageMismatch } from "@/lib/languageDetection";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Store the code and language for client-side enhancement
  const lastAnalysisRef = useRef<{ code: string; language: string } | null>(null);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setResult(null);
    lastAnalysisRef.current = { code, language };

    try {
      const { data, error } = await supabase.functions.invoke("analyze-code", {
        body: { code, language },
      });

      if (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.analysis) {
        // Apply client-side enhancements to ensure features work
        const enhancedResult = enhanceAnalysisResult(data.analysis, code, language);
        console.log("Enhanced result:", enhancedResult);
        setResult(enhancedResult);
      } else if (data?.error) {
        toast({
          title: "Analysis Failed",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side enhancement function to ensure languageMismatch and suggestedPattern are present
  const enhanceAnalysisResult = (
    analysis: AnalysisResult,
    code: string,
    selectedLanguage: string
  ): AnalysisResult => {
    const enhanced = { ...analysis };

    // Apply client-side language mismatch detection if backend didn't provide it
    if (!enhanced.languageMismatch) {
      const mismatch = checkLanguageMismatch(code, selectedLanguage);
      if (mismatch) {
        enhanced.languageMismatch = mismatch;
      }
    }

    // Generate fallback suggested pattern if backend didn't provide one
    if (!enhanced.suggestedPattern && enhanced.issues && enhanced.issues.length > 0) {
      const primaryIssue = enhanced.issues[0];
      enhanced.suggestedPattern = {
        title: "Suggested Safer Pattern",
        explanation: `To address "${primaryIssue.title}", consider implementing input validation, output encoding, and following the principle of least privilege. These fundamental practices help mitigate many common security vulnerabilities.`,
        codeSnippet: getPatternSnippet(primaryIssue.title),
      };
    }

    return enhanced;
  };

  // Get a relevant code snippet based on the issue type
  const getPatternSnippet = (issueTitle: string): string | undefined => {
    const title = issueTitle.toLowerCase();

    if (title.includes("xss") || title.includes("cross-site scripting") || title.includes("reflected")) {
      return `// Instead of directly inserting user input:
// res.send("<h1>" + userInput + "</h1>");

// Use proper encoding/escaping:
import { escapeHtml } from 'your-utility-library';
res.send("<h1>" + escapeHtml(userInput) + "</h1>");

// Or use a templating engine with auto-escaping`;
    }

    if (title.includes("sql") || title.includes("injection")) {
      return `// Instead of string concatenation:
// query("SELECT * FROM users WHERE id = " + userId);

// Use parameterized queries:
query("SELECT * FROM users WHERE id = ?", [userId]);`;
    }

    if (title.includes("command") || title.includes("exec")) {
      return `// Avoid executing user-controlled input:
// exec(userCommand);

// Use allowlists and validate input:
const allowedCommands = ['list', 'status', 'help'];
if (allowedCommands.includes(userInput)) {
  // Execute only pre-defined safe operations
}`;
    }

    return undefined;
  };

  const handleReset = () => {
    setResult(null);
    lastAnalysisRef.current = null;
  };

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <div className="container max-w-4xl mx-auto px-4 pb-16">
        <Header />

        <main className="space-y-8">
          <CodeInput
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isLoading={isLoading}
          />

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            )}

            {!isLoading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisResults result={result} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state hint */}
          {!isLoading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-sm">
                Paste your code above and click <span className="text-primary font-medium">Analyze</span> to get started
              </p>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Built for MLH Hackathon • Educational purposes only • No exploit code generated
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

