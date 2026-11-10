import React, { useState } from 'react';
import { COURSE_MODULES } from '../data/lmsData';
import { CourseModule, StudentProgress, VideoResource } from '../types';
import { BookOpen, CheckCircle, Video, Play, Lightbulb, Code2, Award, ChevronRight, X, ExternalLink } from 'lucide-react';

interface CourseCurriculumProps {
  progress: StudentProgress;
  onCompleteModule: (moduleId: string, xp: number) => void;
  onCompleteQuiz: (moduleId: string, score: number, xp: number) => void;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  progress,
  onCompleteModule,
  onCompleteQuiz,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(COURSE_MODULES[0].id);
  const [activeVideo, setActiveVideo] = useState<VideoResource | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentModule = COURSE_MODULES.find((m) => m.id === selectedModuleId) || COURSE_MODULES[0];
  const isModuleCompleted = progress.completedModules.includes(currentModule.id);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted[currentModule.id]) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    currentModule.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / currentModule.quiz.length) * 100);
    setQuizSubmitted((prev) => ({
      ...prev,
      [currentModule.id]: true,
    }));

    // Reward XP based on quiz result
    const earnedXP = correctCount * 50;
    onCompleteQuiz(currentModule.id, scorePercent, earnedXP);
    if (!isModuleCompleted && scorePercent >= 50) {
      onCompleteModule(currentModule.id, currentModule.xpReward);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {COURSE_MODULES.map((module) => {
          const isSelected = selectedModuleId === module.id;
          const isDone = progress.completedModules.includes(module.id);

          return (
            <button
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isSelected ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-400'
              }`}>
                {module.levelNumber}
              </span>
              <span>{module.levelBadge}</span>
              {isDone && <CheckCircle className="w-4 h-4 text-emerald-400 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Main Two-Zone Layout: Concept & Visual Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Module Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Module Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400 uppercase tracking-wider">
                {currentModule.levelBadge}
              </span>
              <div className="flex items-center gap-3">
                <span>⏱ {currentModule.duration}</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">+{currentModule.xpReward} XP</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {currentModule.title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {currentModule.tagline}
            </p>

            {/* Layman Everyday Life Analogy Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span>The Layman Real-Life Story</span>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed font-normal">
                {currentModule.laymanAnalogy.story}
              </p>
              <div className="pt-2 border-t border-indigo-800/30 text-xs text-indigo-300">
                <strong>Core Takeaway:</strong> {currentModule.laymanAnalogy.realLifeComparison}
              </div>
            </div>
          </div>

          {/* Module Detailed Topics */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Core Understanding & Logic</span>
            </h3>

            {currentModule.topics.map((topic, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
              >
                <h4 className="text-base sm:text-lg font-semibold text-white">
                  {idx + 1}. {topic.title}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {topic.explanation}
                </p>

                {topic.bulletPoints.length > 0 && (
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pl-4 border-l-2 border-slate-800">
                    {topic.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        • {bp}
                      </li>
                    ))}
                  </ul>
                )}

                {topic.codeSnippet && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-indigo-300">
                        {topic.codeSnippet.language.toUpperCase()} Example
                      </span>
                      <span className="text-slate-500">Real-time daily scenario</span>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{topic.codeSnippet.code}</code>
                    </pre>

                    <p className="text-xs text-slate-400 italic">
                      💡 {topic.codeSnippet.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Checkpoint Quiz */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Gaming Checkpoint: Test Your Understanding</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {currentModule.quiz.length} Questions
              </span>
            </div>

            <div className="space-y-6">
              {currentModule.quiz.map((q, qIndex) => {
                const isSelected = quizAnswers[q.id] !== undefined;
                const isSubmitted = quizSubmitted[currentModule.id];
                const isCorrect = isSubmitted && quizAnswers[q.id] === q.correctIndex;
                const isWrong = isSubmitted && isSelected && !isCorrect;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3"
                  >
                    <p className="text-sm font-medium text-slate-200">
                      Q{qIndex + 1}: {q.question}
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((option, optIdx) => {
                        const chosen = quizAnswers[q.id] === optIdx;
                        let optionStyle = 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:border-slate-700';

                        if (isSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-950/60 text-emerald-200 border-emerald-600 font-medium';
                          } else if (chosen && !isCorrect) {
                            optionStyle = 'bg-red-950/60 text-red-200 border-red-600';
                          }
                        } else if (chosen) {
                          optionStyle = 'bg-indigo-600 text-white border-indigo-500 font-medium';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {chosen && !isSubmitted && (
                              <span className="text-xs font-semibold ml-2">Selected</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 mt-2">
                        <strong className="text-indigo-400">Layman Explanation: </strong>
                        {q.laymanExplanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                {!quizSubmitted[currentModule.id] ? (
                  <span>Answer all questions then submit to verify understanding.</span>
                ) : (
                  <span className="text-emerald-400 font-medium">Checkpoint completed!</span>
                )}
              </div>

              {!quizSubmitted[currentModule.id] ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Submit Answers & Claim XP
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Advance to next module
                    const currentIndex = COURSE_MODULES.findIndex((m) => m.id === selectedModuleId);
                    if (currentIndex < COURSE_MODULES.length - 1) {
                      setSelectedModuleId(COURSE_MODULES[currentIndex + 1].id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  <span>Next Module</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Curated YouTube Masterclass Videos & Progress */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* YouTube Videos Playlist Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <span>Curated YouTube Masterclasses</span>
              </h3>
              <span className="text-[11px] text-slate-400">Student Friendly</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Carefully vetted, zero-clickbait video explanations from top educators (Karpathy, Fireship, freeCodeCamp) matching this module.
            </p>

            <div className="space-y-3">
              {currentModule.videos.map((vid, vIdx) => (
                <div
                  key={vIdx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors group cursor-pointer space-y-2"
                  onClick={() => setActiveVideo(vid)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors leading-snug">
                      {vid.title}
                    </span>
                    <Play className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {vid.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="font-medium text-slate-400">{vid.channel}</span>
                    <span>⏱ {vid.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Completion Status */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-200">Track Progress</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Completed Modules:</span>
                <span className="font-semibold text-white">
                  {progress.completedModules.length} / {COURSE_MODULES.length}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: `${(progress.completedModules.length / COURSE_MODULES.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!isModuleCompleted) {
                  onCompleteModule(currentModule.id, currentModule.xpReward);
                }
              }}
              className={`w-full py-2.5 rounded-xl font-semibold transition-colors cursor-pointer mt-2 ${
                isModuleCompleted
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50 cursor-default'
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {isModuleCompleted ? '✓ Module Completed' : 'Mark Module as Read (+XP)'}
            </button>
          </div>
        </div>

      </div>

      {/* Embedded YouTube Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{activeVideo.title}</h3>
                <p className="text-xs text-slate-400">{activeVideo.channel} · Duration: {activeVideo.duration}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Responsive YouTube iFrame */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <p>{activeVideo.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:underline shrink-0 ml-4"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
