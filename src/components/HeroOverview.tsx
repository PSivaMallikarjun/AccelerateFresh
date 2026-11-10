import React from 'react';
import { ActiveTab, StudentProgress } from '../types';
import { Play, Terminal, Cpu, Award, Users, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroOverviewProps {
  progress: StudentProgress;
  setStudentName: (name: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  progress,
  setStudentName,
  setActiveTab,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Mission, and Persona Alignment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                Free Interactive LMS & Career Accelerator
              </span>
              <span>·</span>
              <span className="text-slate-400">Zero Insecurity · Senior Velocity</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">GenAI & Agentic AI</span> Without Feeling Insecure Beside Seniors.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Fresh CS graduates joining fast-moving tech teams often freeze up seeing rapid AI tooling and senior pace. 
              AccelerateFresh breaks everything down in plain everyday language—combining Python from scratch, YouTube masterclasses, hands-on gaming rounds, and corporate psychological simulations.
            </p>

            {/* Student Name Input & Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-300">
                  Student / Fresher Profile:
                </label>
                <div className="flex items-center gap-2 text-xs text-indigo-400">
                  <span className="font-semibold tabular-nums">{progress.totalXP} Total XP Earned</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={progress.studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name (printed on Certificate)"
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Modules: {progress.completedModules.length} / 5</span>
                <span>Gaming Rounds: {progress.completedChallenges.length} / 3</span>
                <span>
                  Exam Status:{' '}
                  {progress.passedExam ? (
                    <span className="text-emerald-400 font-medium">Passed ({progress.examScore}%)</span>
                  ) : (
                    <span className="text-amber-400">Pending</span>
                  )}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('curriculum')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Start Learning Track</span>
              </button>

              <button
                onClick={() => setActiveTab('python-lab')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Python Scratchpad</span>
              </button>

              <button
                onClick={() => setActiveTab('gaming-rounds')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Gaming Rounds</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual & Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
              <img
                src="/src/assets/images/hero_career_accelerator_1794290512128.jpg"
                alt="Modern engineering workspace with dual monitors displaying AI workflows"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container if image fails
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', 'from-indigo-950', 'to-slate-900', 'p-6');
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  The Dual-Pillar Advantage
                </span>
                <p className="text-sm font-medium text-white mt-1">
                  50% Technical GenAI Engineering + 50% High-Trust Senior Collaboration.
                </p>
              </div>
            </div>

            {/* Quick Micro-Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">YouTube Masterclasses</p>
                  <p className="text-slate-400 mt-0.5">Karpathy, 3Blue1Brown, Fireship curated.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Proctored Exam</p>
                  <p className="text-slate-400 mt-0.5">Real-world coding + Verified Certificate.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
