import React from 'react';
import { ActiveTab, StudentProgress } from '../types';
import { BookOpen, Terminal, Cpu, Gamepad2, Users, Award, Sparkles, Rocket } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  progress: StudentProgress;
  onOpenDeployModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onOpenDeployModal,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'curriculum', label: 'Curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'python-lab', label: 'Python Lab', icon: <Terminal className="w-4 h-4" /> },
    { id: 'agentic-lab', label: 'Agentic AI Lab', icon: <Cpu className="w-4 h-4" /> },
    { id: 'gaming-rounds', label: 'Gaming Arena', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'behavioral-sim', label: 'Behavioral Sim', icon: <Users className="w-4 h-4" /> },
    { id: 'proctored-exam', label: 'Proctored Exam', icon: <Award className="w-4 h-4" /> },
    { id: 'ai-mentor', label: 'AI Mentor', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('curriculum')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  AF
                </div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors whitespace-nowrap">
                  AccelerateFresh
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + student XP badge */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Student XP Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold tabular-nums">{progress.totalXP} XP</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 truncate max-w-[90px]">{progress.studentName}</span>
            </div>

            {/* Deploy to Vercel Button */}
            <button
              onClick={onOpenDeployModal}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy to Vercel</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
