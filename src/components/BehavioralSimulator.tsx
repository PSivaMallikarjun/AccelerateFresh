import React, { useState } from 'react';
import { BEHAVIORAL_SCENARIOS } from '../data/behavioralScenarios';
import { BehavioralScenario, ScenarioChoice, StudentProgress } from '../types';
import { Users, MessageSquare, Sparkles, CheckCircle2, ShieldAlert, AlertTriangle, Send, RefreshCw, Award } from 'lucide-react';

interface BehavioralSimulatorProps {
  progress: StudentProgress;
  onAwardXP: (amount: number, reason: string) => void;
}

export const BehavioralSimulator: React.FC<BehavioralSimulatorProps> = ({
  progress,
  onAwardXP,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(BEHAVIORAL_SCENARIOS[0].id);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [customDraft, setCustomDraft] = useState<string>('');
  const [isEvaluatingCustom, setIsEvaluatingCustom] = useState<boolean>(false);
  const [customEvaluationResult, setCustomEvaluationResult] = useState<string | null>(null);

  const scenario = BEHAVIORAL_SCENARIOS.find((s) => s.id === selectedScenarioId) || BEHAVIORAL_SCENARIOS[0];
  const activeChoice: ScenarioChoice | undefined = scenario.options.find((o) => o.id === selectedChoiceId);

  const handleSelectChoice = (choice: ScenarioChoice) => {
    setSelectedChoiceId(choice.id);
    setCustomEvaluationResult(null);

    if (choice.verdict === 'senior-grade') {
      onAwardXP(150, `Mastered behavioral scenario: ${scenario.title}`);
    }
  };

  const handleEvaluateCustomDraft = async () => {
    if (!customDraft.trim()) return;
    setIsEvaluatingCustom(true);
    setCustomEvaluationResult(null);

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          userMessage: customDraft,
          role: scenario.senior.role,
        }),
      });

      const data = await res.json();
      setCustomEvaluationResult(data.response || 'Evaluation completed.');
      onAwardXP(200, 'Custom behavioral draft evaluated by AI Coach');
    } catch {
      setCustomEvaluationResult('Senior Review: Clear effort! Ensure you state what you already verified and link a commit SHA.');
    } finally {
      setIsEvaluatingCustom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-pink-400">
          <Users className="w-4 h-4" />
          <span>Corporate & Behavioral Simulator</span>
          <span>·</span>
          <span className="text-slate-400">The Unwritten Rules of Tech Teams</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Bridge the Gap Between Fresher Insecurity & Senior Respect
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Technical competence alone won’t save you if you freeze in standups or annoy seniors with unstructured Slack DMs. 
          Master how to ask for help, communicate blockers gracefully, and handle harsh code reviews.
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {BEHAVIORAL_SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenarioId(sc.id);
              setSelectedChoiceId(null);
              setCustomDraft('');
              setCustomEvaluationResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedScenarioId === sc.id
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>Scenario 0{idx + 1}: {sc.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Two-Zone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: The Workplace Situation & Choices */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Situation Briefing Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-pink-400 uppercase tracking-wider">
                {scenario.category}
              </span>
              <span className="text-slate-500">Day 14 Onboarding Reality</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {scenario.title}
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              "{scenario.situation}"
            </p>

            {/* Context Secrets */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Key Unwritten Team Invariants:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400 pl-4 border-l-2 border-slate-800">
                {scenario.contextPointers.map((pt, pIdx) => (
                  <li key={pIdx}>• {pt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Multiple Choice Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Choose How You Respond:</span>
              <span className="text-xs text-slate-400 font-normal">Click to see senior reaction</span>
            </h4>

            {scenario.options.map((opt, oIdx) => {
              const isSelected = selectedChoiceId === opt.id;
              let borderStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900';

              if (isSelected) {
                if (opt.verdict === 'senior-grade') borderStyle = 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500';
                else if (opt.verdict === 'flawed') borderStyle = 'border-red-500 bg-red-950/40 ring-1 ring-red-500';
                else borderStyle = 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500';
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectChoice(opt)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${borderStyle}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Option {String.fromCharCode(65 + oIdx)}</span>
                    {isSelected && (
                      <span className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded ${
                        opt.verdict === 'senior-grade' ? 'bg-emerald-900 text-emerald-300' :
                        opt.verdict === 'flawed' ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'
                      }`}>
                        {opt.verdict}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    {opt.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Custom Message Sandbox */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Or Type Your Own Custom Message</span>
              </h4>
              <span className="text-[11px] text-slate-400">AI Senior Evaluator</span>
            </div>

            <textarea
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              rows={4}
              placeholder="Draft your message to the senior lead here... (e.g. state what you tried, the error, and a concrete ask)"
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 leading-relaxed"
            />

            <button
              onClick={handleEvaluateCustomDraft}
              disabled={isEvaluatingCustom || !customDraft.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-pink-600 hover:bg-pink-500 transition-colors shadow-sm cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEvaluatingCustom ? 'AI Lead is Reviewing...' : 'Get Senior AI Lead Feedback'}</span>
            </button>

            {customEvaluationResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 text-xs sm:text-sm text-slate-200 space-y-2 whitespace-pre-wrap leading-relaxed">
                {customEvaluationResult}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Senior Persona Deck & Psychological Reaction */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Senior Persona Dossier */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {scenario.senior.name[0]}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{scenario.senior.name}</h4>
                <p className="text-xs text-pink-400">{scenario.senior.role}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <span className="font-semibold text-slate-400">Communication Style:</span>
                <p className="text-slate-300 mt-0.5">{scenario.senior.communicationStyle}</p>
              </div>
              <div>
                <span className="font-semibold text-red-400">Biggest Pet Peeve:</span>
                <p className="text-slate-300 mt-0.5">{scenario.senior.petPeeve}</p>
              </div>
              <div>
                <span className="font-semibold text-emerald-400">What Impresses Them:</span>
                <p className="text-slate-300 mt-0.5">{scenario.senior.whatImpressesThem}</p>
              </div>
            </div>
          </div>

          {/* Active Choice Feedback / Senior Mind-Reader */}
          {activeChoice ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  Senior Reaction Analysis
                </span>
                <span className={`font-semibold ${
                  activeChoice.verdict === 'senior-grade' ? 'text-emerald-400' :
                  activeChoice.verdict === 'flawed' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  Verdict: {activeChoice.verdict.toUpperCase()}
                </span>
              </div>

              {/* What they actually said or did */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">External Reaction:</span>
                <p className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {activeChoice.seniorReaction}
                </p>
              </div>

              {/* Internal Monologue (Poker Face Revealed) */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400">
                  What Alex is Thinking (Internal Monologue):
                </span>
                <p className="text-xs text-indigo-200 bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/40 italic">
                  {activeChoice.internalMonologue}
                </p>
              </div>

              {/* Rubric Scores */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-400">Communication Rubric:</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="text-slate-500">Clarity</p>
                    <p className="font-bold text-white tabular-nums">{activeChoice.rubricScore.clarity}/10</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="text-slate-500">Empathy</p>
                    <p className="font-bold text-white tabular-nums">{activeChoice.rubricScore.seniorEmpathy}/10</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="text-slate-500">Actionable</p>
                    <p className="font-bold text-white tabular-nums">{activeChoice.rubricScore.actionability}/10</p>
                  </div>
                </div>
              </div>

              {/* Actionable Coaching */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <strong className="text-amber-400">Coaching Note: </strong>
                <span>{activeChoice.coachingFeedback}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-slate-500 text-xs py-12">
              Select an option on the left to see the senior engineer's raw reaction and internal monologue.
            </div>
          )}

          {/* Memorize the Golden Formula */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
            <span className="font-bold text-indigo-300 uppercase tracking-wider">
              Golden Formula to Memorize:
            </span>
            <p className="text-indigo-100 font-mono text-[11px] leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-indigo-900/40">
              {scenario.recommendedFormula}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
