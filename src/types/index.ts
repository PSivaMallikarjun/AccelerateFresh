export type ActiveTab = 
  | 'curriculum' 
  | 'python-lab' 
  | 'agentic-lab' 
  | 'gaming-rounds' 
  | 'behavioral-sim' 
  | 'proctored-exam' 
  | 'ai-mentor';

export interface VideoResource {
  title: string;
  channel: string;
  youtubeId: string;
  duration: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  laymanExplanation: string;
}

export interface CodingExercise {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Real-World';
  language: 'python' | 'javascript';
  prompt: string;
  laymanAnalogy: string;
  starterCode: string;
  solutionCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface CourseModule {
  id: string;
  levelNumber: number;
  levelBadge: string;
  title: string;
  tagline: string;
  laymanAnalogy: {
    story: string;
    realLifeComparison: string;
  };
  duration: string;
  xpReward: number;
  topics: {
    title: string;
    explanation: string;
    bulletPoints: string[];
    codeSnippet?: {
      language: string;
      code: string;
      explanation: string;
    };
  }[];
  videos: VideoResource[];
  quiz: QuizQuestion[];
  codingChallenge?: CodingExercise;
}

export interface CurriculumLesson {
  id: string;
  level: number;
  levelTitle: string;
  title: string;
  readTime: string;
  summary: string;
  keyConcepts: string[];
  codeSnippet: {
    language: string;
    title: string;
    code: string;
  };
  seniorTips: string[];
  commonFresherMistakes: string[];
}

export interface GamingChallenge {
  id: string;
  title: string;
  gameType: 'bug-hunt' | 'prompt-duel' | 'agent-assembly';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Master';
  xp: number;
  scenario: string;
  task: string;
  options?: string[];
  correctAnswer?: number | string;
  feedback: {
    success: string;
    failure: string;
  };
}

export interface SeniorPersona {
  name: string;
  role: string;
  avatarSeed: string;
  communicationStyle: string;
  petPeeve: string;
  whatImpressesThem: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  verdict: 'flawed' | 'mediocre' | 'senior-grade';
  seniorReaction: string;
  internalMonologue: string;
  rubricScore: {
    clarity: number;
    seniorEmpathy: number;
    actionability: number;
  };
  coachingFeedback: string;
}

export interface BehavioralScenario {
  id: string;
  title: string;
  category: 'Blocker & Questions' | 'Standup & Estimates' | 'Code Review' | '1-on-1 & Growth' | 'Pushing Back';
  situation: string;
  senior: SeniorPersona;
  contextPointers: string[];
  options: ScenarioChoice[];
  recommendedFormula: string;
}

export interface AgentStep {
  stepNumber: number;
  agentRole: string;
  thoughtProcess: string;
  toolInvocation: string;
  toolOutput: string;
  reflection: string;
}

export interface StudentProgress {
  completedModules: string[];
  completedQuizzes: Record<string, number>; // moduleId -> score
  completedChallenges: string[];
  completedSimulations: string[];
  totalXP: number;
  passedExam: boolean;
  examScore?: number;
  studentName: string;
}
