import React, { useState } from 'react';
import { GAMING_CHALLENGES } from '../data/lmsData';
import { GamingChallenge, StudentProgress } from '../types';
import { Gamepad2, Trophy, CheckCircle, AlertCircle, Sparkles, RefreshCw, Flame, ArrowRight } from 'lucide-react';

interface GamingArenaProps {
  progress: StudentProgress;
  onCompleteChallenge: (challengeId: string, xp: number) => void;
}

export const GamingArena: React.FC<GamingArenaProps> = ({
  progress,
  onCompleteChallenge,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(GAMING_CHALLENGES[0].id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const currentGame = GAMING_CHALLENGES.find((g) => g.id === selectedGameId) || GAMING_CHALLENGES[0];
  const isCompleted = progress.completedChallenges.includes(currentGame.id);

  const isCorrect = hasSubmitted && selectedOption === currentGame.correctAnswer;

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    if (selectedOption === currentGame.correctAnswer) {
      onCompleteChallenge(currentGame.id, currentGame.xp);
    }
  };

  const handleNextGame = () => {
    const currentIndex = GAMING_CHALLENGES.findIndex((g) => g.id === selectedGameId);
    if (currentIndex < GAMING_CHALLENGES.length - 1) {
      setSelectedGameId(GAMING_CHALLENGES[currentIndex + 1].id);
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  const handleResetCurrent = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Gamepad2 className="w-4 h-4" />
            <span>Practical Gaming Rounds</span>
            <span>·</span>
            <span className="text-slate-400">Zero Boredom, 100% Intuition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            The Interactive Assessment Arena
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Step into the arena! Solve rapid bug hunts, shield against prompt injection duels, and assemble autonomous AI swarms.
          </p>
        </div>

        {/* Total Challenge XP */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <p className="text-slate-400">Completed Rounds</p>
            <p className="text-sm font-bold text-white">
              {progress.completedChallenges.length} / {GAMING_CHALLENGES.length} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Gaming Level Quick Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {GAMING_CHALLENGES.map((game, idx) => {
          const isSelected = selectedGameId === game.id;
          const isDone = progress.completedChallenges.includes(game.id);

          return (
            <button
              key={game.id}
              onClick={() => {
                setSelectedGameId(game.id);
                setSelectedOption(null);
                setHasSubmitted(false);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/80 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-indigo-400">ROUND 0{idx + 1}</span>
                {isDone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Won
                  </span>
                ) : (
                  <span className="text-amber-400">+{game.xp} XP</span>
                )}
              </div>
              <p className="text-sm font-bold text-white truncate">{game.title}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{game.description}</p>
            </button>
          );
        })}
      </div>

      {/* Active Game Stage Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {currentGame.difficulty} Difficulty
            </span>
            <span className="text-slate-400">{currentGame.title}</span>
          </div>

          <span className="text-amber-400 font-semibold tabular-nums">
            Reward: {currentGame.xp} XP
          </span>
        </div>

        {/* Narrative Scenario */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {currentGame.description}
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {currentGame.scenario}
          </div>
        </div>

        {/* Task Question */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-semibold text-white">
            {currentGame.task}
          </p>

          <div className="space-y-2.5">
            {currentGame.options?.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (hasSubmitted) {
                if (optIdx === currentGame.correctAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-600 border-indigo-400 text-white font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSelected && !hasSubmitted && (
                    <span className="text-xs font-semibold ml-2 text-indigo-200">Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section if Submitted */}
        {hasSubmitted && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                : 'bg-red-950/40 border-red-600 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Victory! Round Cleared</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Not quite! Check the clue</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">
              {isCorrect ? currentGame.feedback.success : currentGame.feedback.failure}
            </p>
          </div>
        )}

        {/* Game Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            {hasSubmitted && !isCorrect && (
              <button
                onClick={handleResetCurrent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>

          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-40"
            >
              Lock In Answer
            </button>
          ) : (
            <button
              onClick={handleNextGame}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <span>Next Gaming Round</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
