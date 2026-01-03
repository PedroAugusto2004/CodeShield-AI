// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Language detection patterns - order matters (more specific patterns first)
const languagePatterns: { language: string; patterns: RegExp[]; antiPatterns?: RegExp[] }[] = [
  {
    language: "TypeScript",
    patterns: [
      /:\s*(string|number|boolean|any|void|never)\b/,
      /interface\s+\w+\s*\{/,
      /type\s+\w+\s*=/,
      /<\w+>/,  // generic types
      /as\s+(string|number|boolean|any)/,
    ],
    antiPatterns: [/^#include/m],
  },
  {
    language: "JavaScript",
    patterns: [
      /\bconst\s+\w+\s*=/,
      /\blet\s+\w+\s*=/,
      /\bvar\s+\w+\s*=/,
      /=>\s*\{/,  // arrow functions
      /console\.(log|error|warn)/,
      /function\s+\w+\s*\(/,
      /document\.(getElementById|querySelector)/,
      /window\./,
      /\.forEach\s*\(/,
      /\.map\s*\(/,
      /\.filter\s*\(/,
      /require\s*\(/,
      /module\.exports/,
      /export\s+(default|const|function)/,
      /import\s+.*\s+from\s+['"]/,
    ],
    antiPatterns: [/:\s*(string|number|boolean)\b/, /^package\s+\w+/m],
  },
  {
    language: "Python",
    patterns: [
      /^def\s+\w+\s*\(/m,
      /^class\s+\w+.*:/m,
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /print\s*\(/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
      /self\./,
      /:\s*$/m,  // Python's colon at end of line
      /^\s+pass\s*$/m,
      /elif\s+/,
    ],
  },
  {
    language: "Kotlin",
    patterns: [
      /\bfun\s+\w+\s*\(/,
      /\bval\s+\w+/,
      /\bvar\s+\w+/,
      /println\s*\(/,
      /package\s+\w+(\.\w+)*/,
      /:\s*\w+\s*\?/,  // nullable types
      /when\s*\{/,
      /data\s+class/,
      /companion\s+object/,
    ],
  },
  {
    language: "Java",
    patterns: [
      /public\s+(static\s+)?void\s+main/,
      /public\s+class\s+\w+/,
      /private\s+(final\s+)?\w+\s+\w+/,
      /System\.out\.println/,
      /new\s+\w+\s*\(/,
      /@Override/,
      /extends\s+\w+/,
      /implements\s+\w+/,
    ],
    antiPatterns: [/\bfun\s+/, /\bval\s+/, /\bvar\s+\w+\s*:/],
  },
  {
    language: "C#",
    patterns: [
      /using\s+System/,
      /namespace\s+\w+/,
      /public\s+class\s+\w+/,
      /Console\.(WriteLine|ReadLine)/,
      /static\s+void\s+Main/,
      /\[\w+\]/,  // attributes
      /async\s+Task/,
      /await\s+/,
    ],
  },
  {
    language: "C++",
    patterns: [
      /#include\s*<\w+>/,
      /std::/,
      /cout\s*<</,
      /cin\s*>>/,
      /int\s+main\s*\(/,
      /nullptr/,
      /::\w+/,
      /template\s*</,
    ],
  },
  {
    language: "C",
    patterns: [
      /#include\s*<stdio\.h>/,
      /#include\s*<stdlib\.h>/,
      /printf\s*\(/,
      /scanf\s*\(/,
      /int\s+main\s*\(/,
      /malloc\s*\(/,
      /free\s*\(/,
    ],
    antiPatterns: [/std::/, /cout/, /cin/, /class\s+\w+/],
  },
  {
    language: "Go",
    patterns: [
      /^package\s+main/m,
      /func\s+\w+\s*\(/,
      /fmt\.(Print|Println|Printf)/,
      /:=\s*/,
      /import\s*\(/,
      /go\s+func/,
      /chan\s+\w+/,
    ],
  },
  {
    language: "Rust",
    patterns: [
      /fn\s+\w+\s*\(/,
      /let\s+mut\s+/,
      /println!\s*\(/,
      /impl\s+\w+/,
      /pub\s+fn/,
      /use\s+std::/,
      /->.*\{/,
      /&mut\s+/,
    ],
  },
  {
    language: "Ruby",
    patterns: [
      /^def\s+\w+/m,
      /^end\s*$/m,
      /puts\s+/,
      /\.each\s+do/,
      /require\s+['"]/,
      /attr_(accessor|reader|writer)/,
      /class\s+\w+\s*</,
    ],
    antiPatterns: [/^def\s+\w+\s*\(/m],  // Python has parentheses
  },
  {
    language: "PHP",
    patterns: [
      /<\?php/,
      /\$\w+\s*=/,
      /echo\s+/,
      /function\s+\w+\s*\(/,
      /->(\w+)/,
      /::/,
    ],
  },
  {
    language: "Swift",
    patterns: [
      /\bfunc\s+\w+\s*\(/,
      /\bvar\s+\w+\s*:/,
      /\blet\s+\w+\s*:/,
      /print\s*\(/,
      /guard\s+let/,
      /if\s+let/,
      /@IBOutlet/,
      /@IBAction/,
    ],
    antiPatterns: [/console\.log/, /println\(/],
  },
];

function detectLanguage(code: string): string | null {
  const scores: Record<string, number> = {};

  for (const lang of languagePatterns) {
    let score = 0;

    // Check for positive patterns
    for (const pattern of lang.patterns) {
      if (pattern.test(code)) {
        score += 1;
      }
    }

    // Check for anti-patterns (things that indicate it's NOT this language)
    if (lang.antiPatterns) {
      for (const antiPattern of lang.antiPatterns) {
        if (antiPattern.test(code)) {
          score -= 2;
        }
      }
    }

    if (score > 0) {
      scores[lang.language] = score;
    }
  }

  // Find the language with the highest score
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [language, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestMatch = language;
    }
  }

  return bestMatch;
}

function normalizeLanguageName(lang: string): string {
  const normalized = lang.toLowerCase().trim();
  const mapping: Record<string, string> = {
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "python": "Python",
    "py": "Python",
    "kotlin": "Kotlin",
    "java": "Java",
    "c#": "C#",
    "csharp": "C#",
    "c++": "C++",
    "cpp": "C++",
    "c": "C",
    "go": "Go",
    "golang": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "php": "PHP",
    "swift": "Swift",
  };
  return mapping[normalized] || lang;
}


const SYSTEM_PROMPT = `You are a security-aware software assistant helping developers understand security vulnerabilities in their code.

Your role is to:
1. Analyze the provided code for common security vulnerabilities and mistakes
2. Explain security risks in a CALM, EDUCATIONAL, and NON-ALARMIST tone
3. Suggest safer coding practices at a conceptual, high level
4. Provide a "Suggested Safer Pattern" that demonstrates the principle without fixing the user's specific code
5. DETECT LANGUAGE MISMATCHES - this is critically important

IMPORTANT TONE & STYLE RULES:
- AVOID alarmist language like "highly vulnerable", "severe security breaches", or "critical flaw".
- USE constructive framing like "This pattern can introduce security risks", "Unintended behavior may occur", or "Risk Level: Moderate".
- Classify standard web vulnerabilities (like XSS, SQLi) as "medium" (Moderate) severity unless they are catastrophically open to remote execution.
- NEVER provide step-by-step exploit instructions or working exploit code.
- Frame everything as "Potential Issues" and "Safer Practices".
- EDUCATIONAL ONLY: Do NOT provide a drop-in replacement or a full rewritten version of the user's code.

=== MANDATORY LANGUAGE MISMATCH DETECTION ===
THIS IS REQUIRED. YOU MUST FOLLOW THESE RULES:

STEP 1: Compare the \`language\` parameter to the actual language of the code.
- If user says "Kotlin" but code uses "const", "console.log", arrow functions => it's JavaScript
- If user says "Python" but code uses "let", "var", curly braces => it's JavaScript  
- If user says "JavaScript" but code uses "fun", "val", "println" => it's Kotlin
- And so on for all language pairs

STEP 2: If there IS a mismatch:
- You MUST include the "languageMismatch" field with a non-null value
- "detected" = the actual language of the code (e.g., "JavaScript")
- "message" = "The code appears to be written in [detected], not [selected]. Please select [detected] from the dropdown for more accurate analysis."
- DO NOT mention the language mismatch in the "explanation" field - the UI will show the warning separately

STEP 3: If there is NO mismatch (languages match):
- Set "languageMismatch": null

For each analysis, structure your response in this JSON format:
{
  "issues": [
    {
      "title": "Brief issue title (e.g., 'Reflected User Input')",
      "severity": "high" | "medium" | "low",
      "description": "Clear, calm explanation of the vulnerability."
    }
  ],
  "explanation": "A paragraph explaining the overall security context. NEVER mention language mismatch here - that goes in the languageMismatch field only.",
  "saferPractices": [
    "High-level suggestion for safer coding practice"
  ],
  "suggestedPattern": {
    "title": "Name of the safer pattern",
    "explanation": "Brief explanation of how this pattern mitigates the risk.",
    "codeSnippet": "A short, generic code snippet demonstrating the pattern."
  },
  "languageMismatch": {
    "detected": "The actual language of the code",
    "message": "The code appears to be written in [X], not [Y]. Please select [X] from the dropdown for more accurate analysis."
  }
}

REMEMBER: 
- If languages DON'T match: languageMismatch MUST be an object with "detected" and "message"
- If languages DO match: languageMismatch MUST be null
- NEVER mention language issues in the "explanation" field

Always respond with valid JSON only, no markdown formatting.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();

    if (!code || typeof code !== "string") {
      return new Response(
        JSON.stringify({ error: "Code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = `Analyze the following ${language || "code"} for security vulnerabilities:

\`\`\`${language || ""}
${code}
\`\`\`

Provide your analysis in the specified JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No analysis received" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from the AI
    let aiAnalysis;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      aiAnalysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis results" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-side language detection (more reliable than AI response)
    const detectedLanguage = detectLanguage(code);
    const normalizedSelected = language ? normalizeLanguageName(language) : null;

    console.log("Language detection:", { detectedLanguage, normalizedSelected, selectedLanguage: language });

    // Build a normalized response with ALL required fields explicitly set
    const analysis: {
      issues: Array<{ title: string; severity: string; description: string }>;
      explanation: string;
      saferPractices: string[];
      suggestedPattern: { title: string; explanation: string; codeSnippet: string | null } | null;
      languageMismatch: { detected: string; message: string } | null;
    } = {
      issues: aiAnalysis.issues || [],
      explanation: aiAnalysis.explanation || "No explanation provided.",
      saferPractices: aiAnalysis.saferPractices || [],
      suggestedPattern: null,
      languageMismatch: null
    };

    // Check for language mismatch
    if (detectedLanguage && normalizedSelected && detectedLanguage !== normalizedSelected) {
      console.log("Language mismatch detected!", detectedLanguage, "vs", normalizedSelected);
      analysis.languageMismatch = {
        detected: detectedLanguage,
        message: `The code appears to be written in ${detectedLanguage}, not ${normalizedSelected}. Please select ${detectedLanguage} from the dropdown for more accurate analysis.`
      };
    }

    // Set suggestedPattern from AI or generate fallback
    if (aiAnalysis.suggestedPattern) {
      analysis.suggestedPattern = aiAnalysis.suggestedPattern;
    } else if (analysis.issues.length > 0) {
      // Generate a helpful fallback pattern based on the primary issue
      const primaryIssue = analysis.issues[0];
      analysis.suggestedPattern = {
        title: "Suggested Safer Pattern",
        explanation: `To address "${primaryIssue.title}", consider implementing input validation, output encoding, and following the principle of least privilege. These fundamental practices help mitigate many common security vulnerabilities.`,
        codeSnippet: null
      };
    }

    console.log("Final analysis response:", JSON.stringify(analysis, null, 2));

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-code function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
