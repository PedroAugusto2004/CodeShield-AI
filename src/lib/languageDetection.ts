// Language detection patterns for client-side mismatch detection
// This provides a reliable fallback when backend detection fails

interface LanguagePattern {
    language: string;
    patterns: RegExp[];
    antiPatterns?: RegExp[];
}

const languagePatterns: LanguagePattern[] = [
    {
        language: "TypeScript",
        patterns: [
            /:\s*(string|number|boolean|any|void|never)\b/,
            /interface\s+\w+\s*\{/,
            /type\s+\w+\s*=/,
            /<\w+>/,
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
            /=>\s*\{/,
            /console\.(log|error|warn)/,
            /function\s+\w+\s*\(/,
            /document\.(getElementById|querySelector)/,
            /window\./,
            /\.forEach\s*\(/,
            /\.map\s*\(/,
            /require\s*\(/,
            /module\.exports/,
            /export\s+(default|const|function)/,
            /import\s+.*\s+from\s+['\"]/,
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
            /:\s*$/m,
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
            /:\s*\w+\s*\?/,
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
            /\[\w+\]/,
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
            /->\s*.*\{/,
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
            /require\s+['\"]/,
            /attr_(accessor|reader|writer)/,
            /class\s+\w+\s*</,
        ],
        antiPatterns: [/^def\s+\w+\s*\(/m],
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

const languageNameMapping: Record<string, string> = {
    javascript: "JavaScript",
    js: "JavaScript",
    typescript: "TypeScript",
    ts: "TypeScript",
    python: "Python",
    py: "Python",
    kotlin: "Kotlin",
    java: "Java",
    "c#": "C#",
    csharp: "C#",
    "c++": "C++",
    cpp: "C++",
    c: "C",
    go: "Go",
    golang: "Go",
    rust: "Rust",
    ruby: "Ruby",
    php: "PHP",
    swift: "Swift",
};

export function detectLanguage(code: string): string | null {
    const scores: Record<string, number> = {};

    for (const lang of languagePatterns) {
        let score = 0;

        for (const pattern of lang.patterns) {
            if (pattern.test(code)) {
                score += 1;
            }
        }

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

export function normalizeLanguageName(lang: string): string {
    const normalized = lang.toLowerCase().trim();
    return languageNameMapping[normalized] || lang;
}

export interface LanguageMismatchResult {
    detected: string;
    message: string;
}

export function checkLanguageMismatch(
    code: string,
    selectedLanguage: string
): LanguageMismatchResult | null {
    const detectedLanguage = detectLanguage(code);
    const normalizedSelected = normalizeLanguageName(selectedLanguage);

    if (detectedLanguage && normalizedSelected && detectedLanguage !== normalizedSelected) {
        return {
            detected: detectedLanguage,
            message: `The code appears to be written in ${detectedLanguage}, not ${normalizedSelected}. Please select ${detectedLanguage} from the dropdown for more accurate analysis.`,
        };
    }

    return null;
}
