import React, { useState, useEffect } from 'react';
import { ActiveTab, StudentProgress } from './types';
import { Navbar } from './components/Navbar';
import { HeroOverview } from './components/HeroOverview';
import { CourseCurriculum } from './components/CourseCurriculum';
import { PythonPlayground } from './components/PythonPlayground';
import { AgenticSimulator } from './components/AgenticSimulator';
import { GamingArena } from './components/GamingArena';
import { BehavioralSimulator } from './components/BehavioralSimulator';
import { ProctoredAssessment } from './components/ProctoredAssessment';
import { AIMentorChat } from './components/AIMentorChat';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';

const INITIAL_PROGRESS: StudentProgress = {
  completedModules: ['module-0-intuition'],
  completedQuizzes: {},
  completedChallenges: [],
  completedSimulations: [],
  totalXP: 150,
  passedExam: false,
  studentName: 'Alex Carter',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem('accelerate_fresh_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to initial
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('accelerate_fresh_progress', JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }, [progress]);

  const handleAwardXP = (amount: number, _reason: string) => {
    setProgress((prev) => ({
      ...prev,
      totalXP: prev.totalXP + amount,
    }));
  };

  const handleCompleteModule = (moduleId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
        totalXP: prev.totalXP + xpReward,
      };
    });
  };

  const handleCompleteQuiz = (moduleId: string, score: number, xp: number) => {
    setProgress((prev) => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [moduleId]: score,
      },
      totalXP: prev.totalXP + xp,
    }));
  };

  const handleCompleteChallenge = (challengeId: string, xp: number) => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        totalXP: prev.totalXP + xp,
      };
    });
  };

  const handlePassExam = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      passedExam: true,
      examScore: score,
    }));
  };

  const handleSetStudentName = (name: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {/* Dynamic View Rendering */}
        {activeTab === 'curriculum' && (
          <>
            <HeroOverview
              progress={progress}
              setStudentName={handleSetStudentName}
              setActiveTab={setActiveTab}
            />
            <CourseCurriculum
              progress={progress}
              onCompleteModule={handleCompleteModule}
              onCompleteQuiz={handleCompleteQuiz}
            />
          </>
        )}

        {activeTab === 'python-lab' && (
          <PythonPlayground
            progress={progress}
            onAwardXP={handleAwardXP}
          />
        )}

        {activeTab === 'agentic-lab' && (
          <AgenticSimulator />
        )}

        {activeTab === 'gaming-rounds' && (
          <GamingArena
            progress={progress}
            onCompleteChallenge={handleCompleteChallenge}
          />
        )}

        {activeTab === 'behavioral-sim' && (
          <BehavioralSimulator
            progress={progress}
            onAwardXP={handleAwardXP}
          />
        )}

        {activeTab === 'proctored-exam' && (
          <ProctoredAssessment
            progress={progress}
            onPassExam={handlePassExam}
            onAwardXP={handleAwardXP}
          />
        )}

        {activeTab === 'ai-mentor' && (
          <AIMentorChat />
        )}
      </main>

      {/* Quiet, Clean Domain-Native Footer (Anti-Slop Restraint) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">AccelerateFresh</span>
            <span>·</span>
            <span>Empowering Fresh IT Graduates to Lead with GenAI & Confidence</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Host on Vercel
            </button>
            <button
              onClick={() => setActiveTab('proctored-exam')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Take Certification
            </button>
            <span>© 2026 AccelerateFresh LMS</span>
          </div>
        </div>
      </footer>

      {/* Vercel Deployment Modal */}
      <VercelDeployGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
