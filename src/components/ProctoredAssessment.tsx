import React, { useState, useEffect, useRef } from 'react';
import { StudentProgress } from '../types';
import { ShieldCheck, Video, AlertTriangle, Clock, Award, CheckCircle2, XCircle, RotateCcw, Printer, Share2, Sparkles } from 'lucide-react';

interface ProctoredAssessmentProps {
  progress: StudentProgress;
  onPassExam: (score: number) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

interface ExamQuestion {
  id: string;
  category: 'Python Logic' | 'GenAI Real-Time' | 'Agentic AI' | 'Behavioral';
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'exam-1',
    category: 'Python Logic',
    question: 'How do you safely extract a customer address from a Python dictionary user_profile without causing a KeyError if "address" does not exist?',
    scenario: 'In production microservices, missing JSON keys from third-party APIs frequently crash unhandled code.',
    options: [
      'user_profile["address"]',
      'user_profile.get("address", "N/A")',
      'delete user_profile["address"]',
      'user_profile.address()'
    ],
    correctIndex: 1,
    explanation: 'dict.get(key, default) safely returns the default fallback instead of throwing a fatal KeyError crash.'
  },
  {
    id: 'exam-2',
    category: 'GenAI Real-Time',
    question: 'Why must enterprise microservices use structured JSON outputs (responseSchema) instead of prompting "Please reply in JSON"?',
    scenario: 'Your service parses the AI response directly into a PostgreSQL database table.',
    options: [
      'It makes the model respond faster with colorful emojis',
      'It forces schema-level validation at the model decoding layer, preventing markdown wrappers and hallucinated keys that crash typed systems',
      'Because JSON is only readable by humans',
      'Because SQL databases refuse to accept text'
    ],
    correctIndex: 1,
    explanation: 'Native responseSchema enforces schema invariants during token sampling, eliminating unparseable markdown wrapping.'
  },
  {
    id: 'exam-3',
    category: 'GenAI Real-Time',
    question: 'In an enterprise RAG (Retrieval-Augmented Generation) system, what is the role of a Cross-Encoder Re-ranker?',
    scenario: 'Your vector search matched 25 candidate documentation chunks for a user query.',
    options: [
      'It deletes all vector databases',
      'It scores the joint interaction between the exact query and each candidate chunk, filtering down to the top 3-5 highest-signal context pieces',
      'It translates the query into binary code',
      'It prevents the user from typing questions'
    ],
    correctIndex: 1,
    explanation: 'Cross-encoder re-ranking provides high-precision relevance scoring, preventing context window bloat and lost-in-the-middle degradation.'
  },
  {
    id: 'exam-4',
    category: 'Agentic AI',
    question: 'What defines an Agentic AI architecture as fundamentally distinct from a standard conversational chatbot?',
    scenario: 'A user gives the high-level goal: "Triage failed build #412 and notify the on-call engineer".',
    options: [
      'An agent only writes poetry',
      'An agent runs in an autonomous ReAct loop: decomposing intent into sub-plans, executing external environmental tools, and verifying invariants before completion',
      'An agent does not use language models',
      'An agent requires human approval for every single letter it generates'
    ],
    correctIndex: 1,
    explanation: 'Agents combine reasoning, environmental tool execution, memory, and reflection loops to accomplish multi-step objectives.'
  },
  {
    id: 'exam-5',
    category: 'Agentic AI',
    question: 'Why is a "Critic / Reflection Evaluator" agent critical in an autonomous code generation swarm?',
    scenario: 'An autonomous coder agent just generated a patch for a database connection issue.',
    options: [
      'To verify the code against linters and unit test suites before any deployment or human PR creation',
      'To criticize the engineer who filed the ticket',
      'To slow down the deployment indefinitely',
      'To wipe git commit histories'
    ],
    correctIndex: 0,
    explanation: 'The critic evaluates tests and static analyzers to ensure self-healing iterations occur without pushing broken code to production.'
  },
  {
    id: 'exam-6',
    category: 'Behavioral',
    question: 'According to the "30-Minute Rule", what should a fresher do after spending 30 minutes stuck on a technical blocker without progress?',
    scenario: 'You are working on an authentication task and cannot figure out a 403 error on staging.',
    options: [
      'Keep struggling silently for 6 hours until 10 PM so nobody knows',
      'Send a Slack DM: "Hey, it is broken, help me"',
      'Formulate a structured escalation listing: 1) The goal, 2) The exact error, 3) What you already verified/eliminated, 4) Your hypothesis and commit hash',
      'File an HR complaint against the tech lead'
    ],
    correctIndex: 2,
    explanation: 'Seniors appreciate structured context because it respects their time and shows diligence, allowing a 1-minute asynchronous unblock.'
  },
  {
    id: 'exam-7',
    category: 'Behavioral',
    question: 'How should you respond to a senior engineer who left a critical PR comment: "This function is too long and unmaintainable"?',
    scenario: 'You worked on the PR for 2 days and felt proud of your feature working.',
    options: [
      'Take it as a personal insult and ignore the comment',
      'Argue that "it works fine on my laptop and you are being too strict"',
      'Acknowledge the modularity feedback without ego, explain how you will split it into smaller single-responsibility helpers, and reference the new commit',
      'Delete the branch and quit the team'
    ],
    correctIndex: 2,
    explanation: 'PR feedback is an evaluation of code maintainability, not personal character. Collaborative refactoring builds senior trust.'
  },
  {
    id: 'exam-8',
    category: 'Python Logic',
    question: 'What is the output of this Python code: [x * 2 for x in [1, 2, 3] if x > 1]?',
    scenario: 'List comprehensions are widely used in data pipelines and agent tool parsing.',
    options: [
      '[2, 4, 6]',
      '[4, 6]',
      '[1, 2, 3]',
      '[2, 4]'
    ],
    correctIndex: 1,
    explanation: 'The condition "if x > 1" filters out 1. For x = 2 -> 4, and for x = 3 -> 6. Result is [4, 6].'
  }
];

export const ProctoredAssessment: React.FC<ProctoredAssessmentProps> = ({
  progress,
  onPassExam,
  onAwardXP,
}) => {
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins (900s)
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [tabViolations, setTabViolations] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [certificateHash, setCertificateHash] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Focus / Tab Switch Proctor Detection
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabViolations((prev) => prev + 1);
      }
    };

    const handleBlur = () => {
      setTabViolations((prev) => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, examSubmitted]);

  // Countdown Timer
  useEffect(() => {
    if (!examStarted || examSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeLeft]);

  // Webcam stream handler
  const handleToggleCamera = async () => {
    if (!cameraActive) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraActive(true);
        } else {
          setCameraActive(true); // Fallback visual
        }
      } catch {
        // User denied or no camera, enable simulated proctor feed
        setCameraActive(true);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitted(false);
    setTimeLeft(900);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTabViolations(0);
  };

  const handleSubmitExam = () => {
    let correct = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / EXAM_QUESTIONS.length) * 100);
    setExamSubmitted(true);

    if (scorePercent >= 70) {
      const hash = `AF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setCertificateHash(hash);
      onPassExam(scorePercent);
      onAwardXP(500, `Passed Proctored Certification Exam with ${scorePercent}%!`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let correct = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / EXAM_QUESTIONS.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Proctored Real-Time Assessment Environment</span>
            <span>·</span>
            <span className="text-slate-400">Official Certification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            GenAI & Agentic AI Certification Arena
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Simulate actual high-stakes corporate evaluation conditions. Test-taking integrity with focus monitoring and instant verified certificate generation.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0">
          <span className="text-slate-400">Candidate:</span>
          <span className="font-bold text-white">{progress.studentName}</span>
        </div>
      </div>

      {!examStarted ? (
        /* Pre-Exam Instructions & Camera Setup Card */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-3xl mx-auto space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">
              Assessment Guidelines & Invariants
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              This 15-minute proctored exam evaluates both your technical engineering acumen (Python, RAG, Agentic workflows) and your person-to-person behavioral maturity in fast-paced software organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400">Format & Passing Grade</span>
              <p className="text-slate-300">8 Scenario-based questions. Score 70% or higher to unlock your official Certificate of Completion.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400">Proctoring Sensors</span>
              <p className="text-slate-300">Monitors tab switching, window focus, and optional camera feed preview to ensure dedicated assessment focus.</p>
            </div>
          </div>

          {/* Camera Feed Preview Toggle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                <Video className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Proctor Video Monitor</p>
                <p className="text-[11px] text-slate-400">
                  {cameraActive ? 'Camera stream active' : 'Simulated or real webcam check'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleCamera}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            >
              {cameraActive ? 'Disable Camera' : 'Enable Proctor Camera'}
            </button>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            I Acknowledge & Begin Proctored Assessment
          </button>
        </div>
      ) : !examSubmitted ? (
        /* Live Exam Stage */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 8 Cols: Active Exam Question */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            {/* Top Status */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
              <span className="font-bold text-indigo-400 uppercase tracking-wider">
                Question {currentQIndex + 1} of {EXAM_QUESTIONS.length}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                {EXAM_QUESTIONS[currentQIndex].category}
              </span>
            </div>

            {/* Scenario & Question */}
            <div className="space-y-3">
              <p className="text-xs text-indigo-300 bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/40">
                <strong>Real-World Scenario:</strong> {EXAM_QUESTIONS[currentQIndex].scenario}
              </p>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {EXAM_QUESTIONS[currentQIndex].question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {EXAM_QUESTIONS[currentQIndex].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[EXAM_QUESTIONS[currentQIndex].id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [EXAM_QUESTIONS[currentQIndex].id]: optIdx,
                      }));
                    }}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <span className="text-xs font-semibold ml-2">Selected</span>}
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>

              {currentQIndex < EXAM_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(EXAM_QUESTIONS.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Finalize & Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Right 4 Cols: Proctor Console, Webcam & Timer */}
          <div className="lg:col-span-4 space-y-4">
            {/* Proctor Timer & Integrity Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Time Remaining</span>
                </span>
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Focus Violation Tracker */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Focus Tab Violations:</span>
                </span>
                <span className={`font-mono font-bold ${tabViolations > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {tabViolations}
                </span>
              </div>

              {/* Proctor Webcam Preview Box */}
              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="text-center p-4 text-xs text-slate-500 space-y-1">
                    <Video className="w-6 h-6 mx-auto text-slate-600" />
                    <p>Live Proctor Sensor Active</p>
                    <p className="text-[10px] text-emerald-500">Secure Session In Progress</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-400 font-mono">
                  ● PROCTOR LIVE
                </div>
              </div>

              {/* Question Grid Quick Navigator */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400">Questions:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {EXAM_QUESTIONS.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCur = idx === currentQIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          isCur
                            ? 'bg-indigo-600 text-white'
                            : isAnswered
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-800/40'
                            : 'bg-slate-950 text-slate-500'
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Exam Results & Verifiable Certificate */
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
          {calculateScore() >= 70 ? (
            /* Passed: Render Official Verified Certificate */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Congratulations, {progress.studentName || 'Engineer'}!
                    </h3>
                    <p className="text-xs text-emerald-300">
                      You passed the proctored assessment with a score of {calculateScore()}%.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

              {/* Formal Certificate of Completion */}
              <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border-2 border-indigo-500/40 shadow-2xl text-center space-y-8 overflow-hidden print:p-0 print:border-none print:shadow-none">
                {/* Subtle Decorative Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2">
                  <span className="text-xs tracking-widest font-bold uppercase text-indigo-400">
                    AccelerateFresh Certified Program
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Certificate of Competency
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    This is proudly conferred upon
                  </p>
                </div>

                {/* Student Name */}
                <div className="py-2">
                  <p className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 underline decoration-indigo-500/40 underline-offset-8">
                    {progress.studentName || 'Certified Software Professional'}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  For successfully demonstrating professional mastery in Generative AI systems, Agentic ReAct architectures, Python software foundations, and high-velocity engineering collaboration.
                </p>

                {/* Verification Metadata Footer */}
                <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500 font-semibold">Verification ID</span>
                    <span className="font-mono text-indigo-300">{certificateHash || 'AF-2026-X81A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500 font-semibold">Assessment Score</span>
                    <span className="font-bold text-emerald-400">{calculateScore()}% (Distinction)</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500 font-semibold">Date of Issuance</span>
                    <span className="text-slate-300">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Failed threshold: Guidance to review */
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
              <XCircle className="w-12 h-12 text-red-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Score: {calculateScore()}%</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You need 70% or higher to earn the verified certificate. Don't worry! Review the curriculum modules, practice with the Python Lab, and retake the exam when ready.
              </p>
              <button
                onClick={handleStartExam}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
