# CodeShield AI

> 🛡️ AI-powered security vulnerability explainer for developers

## Hackathon

**MLH Hackathon** – Built entirely during the hackathon period.

## Problem Statement

Developers often write code with security vulnerabilities without realizing it. Traditional security scanners provide technical jargon and complex outputs that are difficult to understand. There's a need for an educational tool that helps developers learn about security in a friendly, accessible way.

## Solution

CodeShield AI is a web application that helps developers understand common security vulnerabilities in their code using AI-powered explanations. Users can:

1. Paste a code snippet
2. Select a programming language (JavaScript or Python)
3. Click "Analyze" to receive:
   - Potential security issues with severity levels
   - Clear, educational explanations in plain English
   - High-level safer coding suggestions

**Important:** This is an educational tool, NOT a penetration testing tool. It never provides exploit code or hacking instructions.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **Backend:** Lovable Cloud (Edge Functions)
- **AI:** Lovable AI Gateway (Gemini)

## Features

- 🔍 Analyze JavaScript and Python code for security issues
- 📚 Educational explanations in plain English
- 🎯 Severity ratings (High, Medium, Low)
- 💡 Safer coding practice suggestions
- ⚡ Real-time analysis with loading states
- 🌙 Dark cybersecurity-themed UI

## How to Run Locally

```bash
# Clone the repository
git clone <repo-url>
cd codeshield-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Safety Considerations

This tool is designed with safety in mind:

- ❌ Does NOT generate exploit code
- ❌ Does NOT provide hacking instructions
- ✅ Focuses on education and awareness
- ✅ Suggests defensive practices only

## Demo

1. Paste code with a potential vulnerability (e.g., SQL concatenation, hardcoded passwords)
2. Select the language
3. Click "Analyze"
4. Review the educational breakdown

---

**Built with ❤️ during MLH Hackathon**
