import { CurriculumLesson } from '../types';

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  {
    id: 'lesson-1-structured-outputs',
    level: 1,
    levelTitle: 'Enterprise GenAI Foundations',
    title: 'From Chatbot Toy to Typed Production JSON',
    readTime: '6 min read',
    summary: 'Freshers often treat LLMs like consumer chatbots that output raw markdown strings. In real enterprise microservices, 95% of GenAI calls must return deterministic, strictly validated JSON schemas.',
    keyConcepts: [
      'Schema-first GenAI with Type constraints and enums',
      'Eliminating regex parsing and hallucinated markdown wrappers',
      'System prompt guardrails vs User prompt injections',
      'Balancing reasoning tokens (Thinking Level) with latency'
    ],
    codeSnippet: {
      language: 'typescript',
      title: 'Production Structured Output with @google/genai',
      code: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define explicit enterprise response schema
export async function triageBugReport(errorLog: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: \`Analyze this production stacktrace: \\n\${errorLog}\`,
    config: {
      systemInstruction: "You are a Site Reliability Engineer. Classify root cause and severity.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, enum: ["SEV1", "SEV2", "SEV3", "SEV4"] },
          affectedService: { type: Type.STRING },
          rootCauseHypothesis: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          isSafeToAutoRollback: { type: Type.BOOLEAN }
        },
        required: ["severity", "affectedService", "rootCauseHypothesis", "isSafeToAutoRollback"]
      }
    }
  });

  // Type-safe JSON with zero markdown wrapping
  return JSON.parse(response.text!);
}`
    },
    seniorTips: [
      'Never write regexes like /```json([\\s\\S]*?)```/ in production. Use native responseSchema.',
      'Seniors care about idempotency: pass seeds or mock fixtures in your CI test runs.',
      'Keep system instructions authoritative; never append user input directly into system prompts.'
    ],
    commonFresherMistakes: [
      'Asking the model "Please reply in JSON" without setting responseMimeType: "application/json".',
      'Letting the LLM invent arbitrary schema keys that crash downstream typed database layers.',
      'Using deprecated SDK methods or passing temperature to newer reasoning models.'
    ]
  },
  {
    id: 'lesson-2-production-rag',
    level: 2,
    levelTitle: 'Knowledge Retrieval (RAG) Architecture',
    title: 'High-Signal RAG: Beyond Naive Vector Search',
    readTime: '8 min read',
    summary: 'Senior engineers know that naive "split text into 500-character chunks and cosine-similarity top 3" fails in production due to lost context and noise. Learn hybrid search and context distillation.',
    keyConcepts: [
      'Dense embeddings vs Sparse BM25 lexical keyword matching',
      'Hierarchical and semantic chunking (preserving AST / markdown headers)',
      'Cross-encoder re-ranking for precision',
      'Grounding citations and attribution'
    ],
    codeSnippet: {
      language: 'typescript',
      title: 'Hybrid Retrieval & Re-ranking Pipeline',
      code: `// Multi-stage RAG: Vector search + Lexical + Re-ranking filter
export async function retrieveRelevantContext(query: string, repoId: string) {
  // Stage 1: Vector embedding search for semantic meaning
  const denseMatches = await vectorDb.query({
    vector: await embedQuery(query),
    topK: 20,
    filter: { repo: repoId }
  });

  // Stage 2: Exact keyword match (BM25) for specific symbol/function names
  const sparseMatches = await searchEngine.bm25({ query, topK: 20 });

  // Stage 3: Reciprocal Rank Fusion (RRF) to combine signals
  const fusedCandidates = reciprocalRankFusion(denseMatches, sparseMatches);

  // Stage 4: Cross-Encoder Re-ranker to pick the top 5 highest-signal context
  const highSignalContext = await reranker.score(query, fusedCandidates.slice(0, 15), { topN: 5 });

  return highSignalContext.map(c => \`[File: \${c.path}:L\${c.startLine}]\\n\${c.content}\`).join("\\n---\\n");
}`
    },
    seniorTips: [
      'Always include the file path and line numbers in chunk metadata so the LLM can cite exact sources.',
      'If your senior complains about hallucinations, 9 times out of 10 your retrieval context is noisy.',
      'Track your retrieval latency: RAG should complete in <300ms before model generation begins.'
    ],
    commonFresherMistakes: [
      'Dumping 20 entire files into the prompt because "the context window is 1M tokens". That causes "lost-in-the-middle" recall degradation and 10x higher billable costs.',
      'Ignoring code boundaries: splitting code midway inside a function or class signature.'
    ]
  },
  {
    id: 'lesson-3-tools-and-functions',
    level: 3,
    levelTitle: 'Tool Use & Function Calling',
    title: 'Empowering Models to Act in Real Environments',
    readTime: '9 min read',
    summary: 'A model that only chats is a spectator. Function calling turns the model into an active operator that queries internal databases, runs test suites, and checks git status.',
    keyConcepts: [
      'Declarative tool specifications (name, description, parameters)',
      'The Execution Loop: Model requests tool -> Application executes -> Returns output',
      'Idempotency and destructive action boundaries (read vs write permissions)',
      'Handling unexpected API timeouts and malformed arguments'
    ],
    codeSnippet: {
      language: 'typescript',
      title: 'Tool Calling Loop with Invariant Checks',
      code: `import { GoogleGenAI, Type } from "@google/genai";

const gitLogTool = {
  name: "getGitCommitDiff",
  description: "Fetches recent git commit diffs for a specified commit hash",
  parameters: {
    type: Type.OBJECT,
    properties: {
      commitHash: { type: Type.STRING, description: "7 or 40 character SHA" }
    },
    required: ["commitHash"]
  }
};

export async function runToolAugmentedSession(userQuery: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: userQuery,
    config: {
      tools: [{ functionDeclarations: [gitLogTool] }]
    }
  });

  // Check if model requested a tool invocation
  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    console.log(\`Model invoked tool: \${call.name}\`, call.args);

    // Guardrail: verify arguments before execution
    const toolResult = await safeExecuteTool(call.name, call.args);

    // Pass tool result back to model for final synthesis
    const finalAnswer = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        { role: "user", parts: [{ text: userQuery }] },
        { role: "model", parts: [{ functionCall: call }] },
        { role: "user", parts: [{ functionResponse: { name: call.name, response: { output: toolResult } } }] }
      ]
    });

    return finalAnswer.text;
  }

  return response.text;
}`
    },
    seniorTips: [
      'Write exhaustive docstrings in your tool description. The model selects tools based almost entirely on your description accuracy.',
      'Always sandbox destructive tool operations (DROP TABLE, rm -rf, git push --force) with mandatory human confirmation.',
      'Log every tool invocation with execution duration and token cost.'
    ],
    commonFresherMistakes: [
      'Allowing tools to return 50,000 lines of raw unformatted logs, immediately exhausting model context.',
      'Writing vague tool descriptions like "tool to do stuff with database".'
    ]
  },
  {
    id: 'lesson-4-agentic-architectures',
    level: 4,
    levelTitle: 'Agentic AI Systems & Multi-Agent Swarms',
    title: 'The ReAct Loop, Memory, and Autonomous Reflection',
    readTime: '12 min read',
    summary: 'The pinnacle of modern engineering: Autonomous Agents. Learn how agents decompose ambiguous user goals into step-by-step plans, maintain memory across iterations, and critique their own solutions.',
    keyConcepts: [
      'The ReAct Triad: Thought (Reasoning) -> Action (Tool Call) -> Observation (Feedback)',
      'Plan-and-Solve vs Reactive Execution',
      'Critic & Reflection loops (self-healing code generation)',
      'Multi-Agent Architectures: Planner, Coder, Reviewer, and QA agents'
    ],
    codeSnippet: {
      language: 'typescript',
      title: 'Autonomous Reflection & Self-Correction Loop',
      code: `// Agentic Loop with Self-Correction Critic
export async function runSelfHealingAgent(objective: string, maxIterations = 3) {
  let currentAttempt = 0;
  let codeDraft = "";
  let criticFeedback = "";

  while (currentAttempt < maxIterations) {
    currentAttempt++;
    console.log(\`--- Agent Iteration \${currentAttempt}/\${maxIterations} ---\`);

    // 1. Generation Step (incorporating critic feedback from prior cycle)
    codeDraft = await generateCodeDraft(objective, codeDraft, criticFeedback);

    // 2. Automated Tool Verification (Linter + Unit Tests)
    const testResult = await executeAutomatedTestSuite(codeDraft);

    if (testResult.allPassed) {
      console.log("All unit tests passed. Solution verified.");
      return { status: "SUCCESS", code: codeDraft, iterations: currentAttempt };
    }

    // 3. Critic & Reflection Step
    console.warn("Tests failed. Invoking Critic Agent to analyze regression.");
    criticFeedback = await evaluateFailureReason(objective, codeDraft, testResult.errorLog);
  }

  return { status: "FAILED_THRESHOLD", code: codeDraft, lastError: criticFeedback };
}`
    },
    seniorTips: [
      'Always set hard maxIteration caps on agent loops (e.g. 5 loops) to prevent runaway billing or infinite loops.',
      'Separate your agents into distinct responsibilities: a Planner shouldn\'t be writing line-by-line code.',
      'The secret to looking senior: propose Agentic automations for boring team chores (e.g. automated flaky test triage, dependency CVE patcher).'
    ],
    commonFresherMistakes: [
      'Giving an agent free rein without intermediate evaluation checkpoints or test verification.',
      'Conflating a single prompt chain with a true agentic system. An agent must possess environmental feedback and adaptive branching.'
    ]
  }
];
