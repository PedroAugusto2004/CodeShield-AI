import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ShieldCheck, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SecurityIssue {
  title: string;
  severity: "high" | "medium" | "low";
  description: string;
}

export interface AnalysisResult {
  issues: SecurityIssue[];
  explanation: string;
  saferPractices: string[];
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const severityConfig = {
  high: {
    icon: AlertTriangle,
    label: "High",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  medium: {
    icon: AlertTriangle,
    label: "Medium",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  low: {
    icon: Info,
    label: "Low",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const hasIssues = result.issues.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Issues Section */}
      <div className="result-card p-6">
        <div className="flex items-center gap-2 mb-4">
          {hasIssues ? (
            <AlertTriangle className="w-5 h-5 text-warning" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-success" />
          )}
          <h3 className="text-lg font-semibold">
            {hasIssues ? "Potential Security Issues" : "No Issues Found"}
          </h3>
          {hasIssues && (
            <Badge variant="outline" className="ml-2 text-xs">
              {result.issues.length} found
            </Badge>
          )}
        </div>

        {hasIssues ? (
          <ul className="space-y-4">
            {result.issues.map((issue, index) => {
              const config = severityConfig[issue.severity];
              const Icon = config.icon;
              
              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      issue.severity === 'high' ? 'text-destructive' : 
                      issue.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium">{issue.title}</span>
                        <Badge variant="outline" className={`text-xs ${config.className}`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm text-foreground/80">
              Great job! This code appears to follow good security practices.
            </p>
          </div>
        )}
      </div>

      {/* Explanation Section */}
      <div className="result-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Explanation</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {/* Safer Practices Section */}
      <div className="result-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold">Safer Coding Practices</h3>
        </div>
        <ul className="space-y-3">
          {result.saferPractices.map((practice, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              <span className="text-sm text-foreground/80">{practice}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
