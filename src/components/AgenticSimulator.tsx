import React, { useState } from 'react';
import { AgentStep } from '../types';
import { Cpu, Play, RotateCcw, ArrowRight, CheckCircle2, Terminal, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const AgenticSimulator: React.FC = () => {
  const PRESET_GOALS = [
    {
      title: 'Auto-Fix Production Memory Leak',
      category: 'Site Reliability Engineering',
      goal: 'Identify connection leak in Node.js payment gateway, generate idempotent pool release patch, verify with unit tests, and create PR.',
    },
    {
      title: 'Autonomous Travel & Conference Concierge',
      category: 'Enterprise Operations',
      goal: 'Find roundtrip flights to San Francisco under $600 for TechConf, reserve quiet hotel near Moscone Center, and post itinerary in #eng-travel.',
    },
    {
      title: 'Customer Churn SQL Analysis & Email Synthesis',
      category: 'Product Analytics',
      goal: 'Query customer database for accounts with 0 logins in last 14 days, aggregate churn risk metrics, and draft personalized retention emails.',
    },
  ];

  const [selectedGoal, setSelectedGoal] = useState<string>(PRESET_GOALS[0].goal);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<AgentStep[]>([
    {
      stepNumber: 1,
      agentRole: 'Planner & Intent Decomposer',
      thoughtProcess: 'Goal received: "Identify connection leak in payment gateway...". Breaking goal into dependency tree: 1) Grep heap dump stack traces, 2) Pinpoint leaked pool client, 3) Synthesize patch with finally block, 4) Execute regression test suite.',
      toolInvocation: 'plan_breakdown({ objective: "fix_memory_leak", max_retries: 3 })',
      toolOutput: 'Decomposed into 4 discrete tasks with invariants verified. Ready to invoke context search.',
      reflection: 'Planner verified task safety: read-only analysis first before any code alteration.',
    },
    {
      stepNumber: 2,
      agentRole: 'Context & Code Retrieval (RAG)',
      thoughtProcess: 'Executing semantic search across payment repo to locate unreleased database transactions and connection pool clients.',
      toolInvocation: 'grep_codebase({ pattern: "pool.connect()", exclude: "node_modules" })',
      toolOutput: 'Found 3 occurrences. File src/services/paymentService.ts:L42 opens connection without enclosing in try...finally release.',
      reflection: 'Root cause confirmed. Leaked client on line 48 during error scenarios.',
    },
    {
      stepNumber: 3,
      agentRole: 'Coder & Tool Execution Agent',
      thoughtProcess: 'Drafting patch wrapping pool connection in try/catch/finally block to guarantee client.release() even if payment provider rejects.',
      toolInvocation: 'apply_code_patch({ file: "src/services/paymentService.ts", lineStart: 40, lineEnd: 55 })',
      toolOutput: 'Patch applied successfully. 14 lines modified. Added client.release() in finally handler.',
      reflection: 'Syntax checked cleanly. Moving to automated verification.',
    },
    {
      stepNumber: 4,
      agentRole: 'Critic & Reflection Evaluator',
      thoughtProcess: 'Running automated mocha/jest test suite to verify leak is resolved and no regressions were introduced.',
      toolInvocation: 'run_test_suite({ filter: "paymentService.test.ts" })',
      toolOutput: 'PASS: 24/24 tests passed in 1.82s. Zero active connection handles remained open after exception simulation.',
      reflection: 'Invariants satisfied. Goal completed with 100% test confidence. Autonomous ticket closed.',
    },
  ]);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setCurrentStepIndex(0);

    const goalToRun = customGoal.trim() || selectedGoal;

    try {
      const res = await fetch('/api/gemini/simulate-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskGoal: goalToRun }),
      });
      const data = await res.json();
      if (data.steps && data.steps.length > 0) {
        setSteps(data.steps);
      }
    } catch {
      // Graceful fallback to rich local steps
    }

    // Step-by-step animated progression
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < 4) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
          <Cpu className="w-4 h-4" />
          <span>Interactive Agentic Architecture Simulator</span>
          <span>·</span>
          <span className="text-slate-400">The Autonomous ReAct Loop</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Watch AI Agents Plan, Execute Tools, and Self-Correct
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          While standard chatbots merely answer questions, <strong className="text-white">Agentic AI</strong> possesses agency: 
          it decomposes goals, invokes environmental tools (APIs, file search, test runners), and critiques its own work until the mission is accomplished.
        </p>
      </div>

      {/* Goal Selector & Architecture Visual Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Cols: Choose or Type a Goal */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            1. Select an Enterprise Scenario Goal
          </h3>

          <div className="space-y-3">
            {PRESET_GOALS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedGoal(preset.goal);
                  setCustomGoal('');
                  handleReset();
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedGoal === preset.goal && !customGoal
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold mb-1">
                  <span>{preset.title}</span>
                  <span className="text-slate-500">{preset.category}</span>
                </div>
                <p className="line-clamp-2 text-slate-300">{preset.goal}</p>
              </div>
            ))}
          </div>

          {/* Custom Goal Input */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300">
              Or write a custom Agentic Goal:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Scrape latest release notes, verify API changes, notify Slack"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimulating ? 'Autonomous Loop Running...' : 'Launch Agentic Workflow'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Visual Representation Diagram */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="p-4 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Agentic Core Anatomy</span>
            </span>
            <span className="text-[10px] text-slate-400">ReAct Framework</span>
          </div>

          <div className="relative p-3 flex-1 flex items-center justify-center">
            <img
              src="/src/assets/images/agentic_ai_flow_1794290512759.jpg"
              alt="Autonomous AI Agent Architecture showing Planner, Tool Execution, Memory, and Reflection"
              className="w-full h-auto max-h-64 object-contain rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong>Key takeaway:</strong> The agent does not guess. In every iteration, it tests the output against real invariants before moving forward.
          </div>
        </div>

      </div>

      {/* Step Progression Visualizer & Execution Log */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Real-Time ReAct Execution Trace</span>
        </h3>

        {/* Step Nodes Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-950 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : isPast
                    ? 'bg-slate-900/80 border-emerald-800/60 text-slate-300'
                    : 'bg-slate-950 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                  <span>Step {st.stepNumber}</span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isCurrent && <span className="text-indigo-400 animate-pulse">● ACTIVE</span>}
                </div>
                <p className="text-xs font-bold text-white truncate">{st.agentRole}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Trace Card */}
        {steps[currentStepIndex] && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {steps[currentStepIndex].stepNumber}
                </span>
                <h4 className="text-base font-bold text-white">
                  {steps[currentStepIndex].agentRole}
                </h4>
              </div>
              <span className="text-xs text-indigo-400 font-mono">Stage {currentStepIndex + 1} of 4</span>
            </div>

            {/* Thought Process */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Reasoning & Hypothesis (Thought)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {steps[currentStepIndex].thoughtProcess}
              </p>
            </div>

            {/* Tool Invocation */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                2. Tool Call Dispatched (Action)
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 text-xs font-mono text-purple-300 overflow-x-auto">
                <code>{steps[currentStepIndex].toolInvocation}</code>
              </pre>
            </div>

            {/* Tool Output / Observation */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                3. Environmental Observation (Result)
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 text-xs font-mono text-emerald-300 leading-relaxed">
                {steps[currentStepIndex].toolOutput}
              </div>
            </div>

            {/* Reflection / Critic Evaluation */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                4. Critic Reflection & Verification (Invariants Checked)
              </span>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200 leading-relaxed">
                ✓ {steps[currentStepIndex].reflection}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
