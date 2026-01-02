import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { CodeInput } from "@/components/CodeInput";
import { AnalysisResults, AnalysisResult } from "@/components/AnalysisResults";
import { LoadingState } from "@/components/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setResult(null);

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
        setResult(data.analysis);
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

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <div className="container max-w-4xl mx-auto px-4 pb-16">
        <Header />

        <main className="space-y-8">
          <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

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
