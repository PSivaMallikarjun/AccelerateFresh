import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. API: AI Workplace & Behavioral Coach
app.post('/api/gemini/coach', async (req, res) => {
  try {
    const { scenarioId, scenarioTitle, userMessage, context, role } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    if (!ai) {
      // High-quality deterministic fallback if no API key is set
      return res.json({
        response: generateHeuristicFeedback(scenarioId, userMessage),
        fallback: true,
      });
    }

    const systemInstruction = `You are a Senior Principal Engineer and Staff Mentor at a top-tier tech organization.
Your mission is to coach newly joined freshers (recent CS/AI/ML graduates) who suffer from imposter syndrome, anxiety around fast-paced senior engineers, or insecurity about asking questions and shipping code.
Context of interaction: ${context || 'General corporate & technical coaching'}
Current scenario: ${scenarioTitle || 'Workplace interaction'}
Target role being simulated: ${role || 'Senior Tech Lead'}

Analyze the fresher's input carefully. Provide:
1. "Senior Lead Perspective": How a real busy senior dev or manager perceives this.
2. "Rubric Evaluation": (Scores out of 10 for: Clarity, Professionalism, Senior Empathy, Actionability).
3. "Actionable Coaching": What worked well, and what to refine.
4. "Exemplary Rewrite": A polished, high-leverage version of how a confident, respected junior/mid-level engineer would say it.

Keep tone constructive, encouraging, empathetic yet rigorously professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      response: response.text,
      fallback: false,
    });
  } catch (error: any) {
    console.error('Gemini coach API error:', error);
    return res.json({
      response: generateHeuristicFeedback(req.body.scenarioId, req.body.userMessage),
      fallback: true,
      error: error.message,
    });
  }
});

// 2. API: Agentic AI Workflow Simulation
app.post('/api/gemini/simulate-agent', async (req, res) => {
  try {
    const { taskGoal, framework } = req.body;
    if (!taskGoal) {
      return res.status(400).json({ error: 'taskGoal is required' });
    }

    if (!ai) {
      return res.json({
        steps: getFallbackAgentSteps(taskGoal),
        fallback: true,
      });
    }

    const systemInstruction = `You are an Agentic AI Architecture Engine.
Deconstruct the user's high-level software engineering goal into an autonomous Agentic Workflow.
Output a strict JSON array with 4-5 executable steps.
Each step must contain:
- stepNumber (integer)
- agentRole (e.g. "Planner Agent", "Retrieval & Context Agent", "Coder & Refactoring Agent", "Critic & Linter Agent", "Deploy & Observability Agent")
- thoughtProcess (string explaining the reasoning)
- toolInvocation (string representing tool call, e.g., 'grep_codebase({"query": "leak"})' or 'execute_test_suite()')
- toolOutput (simulated realistic technical output)
- reflection (critic review assessing if invariants held and next steps)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Task Goal: "${taskGoal}". Framework: ${framework || 'ReAct / Multi-Agent Swarm'}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ steps: parsed, fallback: false });
  } catch (error: any) {
    console.error('Agent simulation API error:', error);
    return res.json({
      steps: getFallbackAgentSteps(req.body.taskGoal || 'Debug issue'),
      fallback: true,
    });
  }
});

function generateHeuristicFeedback(scenarioId: string, userMessage: string) {
  return `### Senior Lead Perspective
Your communication shows genuine effort to solve the problem before escalating. You've clearly invested thought into this, which senior engineers deeply appreciate.

### Rubric Assessment
- **Clarity:** 8.5/10 — The core blocker or question is directly stated.
- **Professionalism:** 9.0/10 — Respectful and calm tone.
- **Senior Empathy:** 8.0/10 — Respects senior time constraints by organizing the context.
- **Actionability:** 8.5/10 — Provides the team with immediate steps to unblock you.

### Actionable Coaching Tips
1. **The 30-Minute Rule Principle:** Always prefix with the specific error trace and the 2 hypotheses you already eliminated. This immediately prevents seniors from asking "did you try X?"
2. **Include Links or Commit Hashes:** Add a link to your branch or PR preview so the senior dev can inspect it in 15 seconds without having to pull your code locally.

### Exemplary Rewrite
> *"Hey @Alex, I'm currently blocked on the OAuth callback token refresh on branch \`feat/auth-v2\`. I've spent ~30 mins digging in: verified client credentials and inspected the headers. The token endpoint returns a 401 with invalid_grant. My hypothesis is clock skew or missing redirect_uri parameter. Could you spare 5 mins or glance at commit \`a39f10\` when you have a breath? Appreciate it!"*`;
}

function getFallbackAgentSteps(goal: string) {
  return [
    {
      stepNumber: 1,
      agentRole: 'Planner & Intent Classifier',
      thoughtProcess: `Analyzing objective: "${goal}". Breaking down requirements into stateful dependencies, edge cases, and safety checks.`,
      toolInvocation: 'plan_breakdown({ task: "' + goal.replace(/"/g, '') + '", depth: "production" })',
      toolOutput: 'Decomposed into 4 discrete tasks: 1) AST analysis, 2) Safe patch generation, 3) Automated test suite execution, 4) Static verification.',
      reflection: 'Plan passes enterprise safety boundaries. Proceeding to codebase context retrieval.',
    },
    {
      stepNumber: 2,
      agentRole: 'Retrieval & Context Agent (RAG)',
      thoughtProcess: 'Executing semantic and keyword search across target repositories to locate relevant modules and invariant contracts.',
      toolInvocation: 'vector_search({ query: "auth token lifecycle handlers and error boundaries", top_k: 4 })',
      toolOutput: 'Matched files: src/auth/tokenService.ts (similarity: 0.94), src/middleware/verifyToken.ts (similarity: 0.89).',
      reflection: 'Found key interceptor on lines 42-88. Context window prepared for synthesis.',
    },
    {
      stepNumber: 3,
      agentRole: 'Coder & Tool Execution Agent',
      thoughtProcess: 'Synthesizing defensive refactoring with strict TypeScript types and exponential retry policy.',
      toolInvocation: 'apply_patch({ file: "src/auth/tokenService.ts", patch_type: "idempotent_retry" })',
      toolOutput: 'Patch applied cleanly. 32 lines modified. Added mutex lock around refresh promise.',
      reflection: 'Patch maintains backwards compatibility with existing SessionProvider.',
    },
    {
      stepNumber: 4,
      agentRole: 'Critic & Reflection Evaluator',
      thoughtProcess: 'Running test runner and linter to verify zero regressions and type safety.',
      toolInvocation: 'run_evals({ suite: "unit_and_integration", test_filter: "auth" })',
      toolOutput: 'PASS: 18/18 tests passed in 1.42s. 100% branch coverage on tokenService.ts.',
      reflection: 'All invariants verified. Ready for PR review and deployment staging.',
    },
  ];
}

// Development with Vite vs Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupServer();
