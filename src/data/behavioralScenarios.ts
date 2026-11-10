import { BehavioralScenario } from '../types';

export const BEHAVIORAL_SCENARIOS: BehavioralScenario[] = [
  {
    id: 'scenario-1-blocked-help',
    title: 'The 30-Minute Rule: Stuck on a Production Bug',
    category: 'Blocker & Questions',
    situation: 'You are on Day 14 at the company. You have been debugging a 401 Unauthorized token error in the payment service for 45 minutes. You feel your heart racing: "If I ask, they will think I am stupid and regret hiring me. If I don\'t ask, I will waste the whole afternoon."',
    senior: {
      name: 'Alex Rivera',
      role: 'Staff Platform Engineer',
      avatarSeed: 'alex',
      communicationStyle: 'Hyper-efficient, impatient with vague complaints, but deeply helpful if given concrete context.',
      petPeeve: 'Getting a DM that just says "Hi" or "It is not working, can you help?"',
      whatImpressesThem: 'Engineers who list: 1) What they tried, 2) The exact error line, 3) Their current hypothesis.'
    },
    contextPointers: [
      'The 30-Minute Rule: Try on your own for 30 mins. If zero progress, escalating with structure is MANDATORY, not a weakness.',
      'Seniors are not annoyed by questions; they are annoyed by having to play 20 Questions to understand your problem.',
      'Always link branch name or provide the exact stacktrace line.'
    ],
    recommendedFormula: '[Exact Goal] + [Error/Blocker] + [What I Tried (2-3 bullets)] + [My Hypothesis] + [Low-friction ask: 5 mins or glance at branch]',
    options: [
      {
        id: 'opt-1-flawed',
        text: '"Hey Alex, sorry to bother you... the auth service is broken on my machine and I don\'t know why. I have tried everything and nothing works. Can you come to my desk and fix it?"',
        verdict: 'flawed',
        seniorReaction: 'Sighs deeply, feels annoyed because they now have to context-switch blindly and diagnose basic things like "is Docker running?".',
        internalMonologue: '"I have a deployment in 20 minutes. What does \'everything\' mean? Did you check your .env? Did you pull main? Now I have to spend 15 minutes asking basic triage questions."',
        rubricScore: { clarity: 3, seniorEmpathy: 2, actionability: 3 },
        coachingFeedback: 'Never say "I tried everything" or ask someone to "fix it". It broadcasts learned helplessness. Be specific about your reproducible steps.'
      },
      {
        id: 'opt-2-mediocre',
        text: '"Hi Alex! Hope you are having a great week! Just wanted to check if you have some free time today to talk about the payment service token error? Let me know whenever you are free."',
        verdict: 'mediocre',
        seniorReaction: 'Leaves the message on "Read" for 3 hours because there is no urgency or context to evaluate.',
        internalMonologue: '"If I say yes, I am committing to an unknown black hole of time. Why didn\'t they tell me the error so I could just paste a 1-line answer?"',
        rubricScore: { clarity: 5, seniorEmpathy: 5, actionability: 4 },
        coachingFeedback: 'The "asking to ask" anti-pattern. Never ask if someone has time before explaining what you need. State the problem upfront so they can answer asynchronously in 10 seconds if they know the answer.'
      },
      {
        id: 'opt-3-senior-grade',
        text: '"Hey Alex, I am blocked on the OAuth refresh token on branch feat/pay-v2. The /token endpoint returns 401 invalid_grant. What I\'ve verified: 1) Client secrets match staging .env, 2) Token expiration timestamp is valid. My hypothesis is missing redirect_uri parameter in the header. Whenever you have 3 mins, could you take a glance or advise if there is an auth proxy running locally? Commit a491b. Thanks!"',
        verdict: 'senior-grade',
        seniorReaction: 'Smiles, types back in 45 seconds: "Check local docker-compose: port 8081 proxies that. Set AUTH_PROXY_PORT=8081 in .env. Good catch on the headers!"',
        internalMonologue: '"Wow, this fresher did real homework, isolated the error, and gave me the commit hash. Took me 30 seconds to unblock them. Great hire."',
        rubricScore: { clarity: 10, seniorEmpathy: 10, actionability: 10 },
        coachingFeedback: 'Outstanding! You showed diligence, respected their time, provided reproduction evidence, and offered a reasonable hypothesis. This is how seniors communicate with each other.'
      }
    ]
  },
  {
    id: 'scenario-2-standup-delay',
    title: 'Daily Standup Under Pressure: Behind Schedule',
    category: 'Standup & Estimates',
    situation: 'Yesterday you said your ticket "Build API endpoint for User Export" would take 1 day. You encountered unexpected legacy database locks and completed only 30%. It is 9:55 AM, standup starts in 5 minutes with the Engineering Manager and Lead listening.',
    senior: {
      name: 'Elena Rostova',
      role: 'Engineering Manager & Tech Lead',
      avatarSeed: 'elena',
      communicationStyle: 'Data-driven, values predictability over heroics, hates surprises on sprint demo day.',
      petPeeve: 'Hearing an engineer say "Almost done, 90% finished" for 4 consecutive days.',
      whatImpressesThem: 'Engineers who proactively signal delays early with adjusted estimates and specific blocker details.'
    },
    contextPointers: [
      'Standup is a synchronization checkpoint, NOT an interrogation room.',
      'Seniors also blow estimates regularly. The difference is they communicate the delta with reasons immediately.',
      'Never hide a delay hoping you will make up for it by working until 3 AM.'
    ],
    recommendedFormula: '[What got done yesterday] + [The concrete blocker encountered] + [Adjusted timeline] + [Specific action planned today]',
    options: [
      {
        id: 'opt-1-flawed',
        text: '"Yesterday I worked on the export ticket. Today I will continue working on it. No blockers, it is almost done."',
        verdict: 'flawed',
        seniorReaction: 'Manager makes a mental note of low trust. When tomorrow comes and the ticket is still open, it looks dishonest.',
        internalMonologue: '"They said no blockers, but git shows zero commits. Why are they hiding the status? If this slips tomorrow, our client demo is jeopardized."',
        rubricScore: { clarity: 2, seniorEmpathy: 2, actionability: 2 },
        coachingFeedback: 'The classic fresher trap: lying that there are "no blockers" out of fear. This destroys manager trust faster than any technical bug.'
      },
      {
        id: 'opt-2-mediocre',
        text: '"Yesterday I spent the whole day stuck on database locks and it was so frustrating because the legacy code has zero documentation and nobody answered me in Slack. I hope I can finish it today."',
        verdict: 'mediocre',
        seniorReaction: 'Senses negativity and blame-shifting. Team energy dips.',
        internalMonologue: '"Legacy code is messy, yes, but venting in standup doesn\'t solve the dependency. How many hours do you actually need?"',
        rubricScore: { clarity: 5, seniorEmpathy: 4, actionability: 5 },
        coachingFeedback: 'Standup is not the place to vent emotional frustration about legacy systems. Keep it objective, professional, and forward-looking.'
      },
      {
        id: 'opt-3-senior-grade',
        text: '"Yesterday I finished the export serialization and unit tests. However, during integration testing I hit table-level deadlocks in the legacy user_history schema, which blocked me. I\'ve scoped a fix to use read-replica connections with pagination. I am ~50% through and estimate finishing tomorrow afternoon instead of today. Marcus, could I sync with you for 10 mins after standup on read-replica permissions?"',
        verdict: 'senior-grade',
        seniorReaction: 'Elena nods in appreciation: "Great catch on the replica locks. Marcus, help them with permissions right after this. Adjusted sprint forecast noted."',
        internalMonologue: '"Clear diagnosis, proactive schedule update, and already scheduled the unblocking conversation. Zero panic, pure professionalism."',
        rubricScore: { clarity: 10, seniorEmpathy: 9, actionability: 10 },
        coachingFeedback: 'Flawless execution. You acknowledged the delay without shame, pinpointed the technical cause, updated the estimate, and lined up the exact collaborator needed.'
      }
    ]
  },
  {
    id: 'scenario-3-pr-review-critique',
    title: 'PR Review Conflict: Harsh Senior Comments',
    category: 'Code Review',
    situation: 'You spent 3 days on a Pull Request. You open GitHub in the morning and see 8 comments from the Lead Architect, including: "This function is 120 lines, completely unreadable, and violates single responsibility. Why are we doing raw SQL queries here instead of using the repository pattern?" Your stomach sinks.',
    senior: {
      name: 'David Chen',
      role: 'Principal Software Architect',
      avatarSeed: 'david',
      communicationStyle: 'Blunt, concise, obsessed with long-term codebase maintainability. Code comments sound colder than he actually is.',
      petPeeve: 'Engineers who take code critiques as personal attacks or mark comments as resolved without changing the code.',
      whatImpressesThem: 'Engineers who say "Great catch, here is how I restructured it" and ask about architectural trade-offs.'
    },
    contextPointers: [
      'PR comments are critiques of the CODE, not critiques of YOU as a human being.',
      'Seniors write tersely because they review 15 PRs a day, not because they dislike you.',
      'Treat PR reviews as free, high-tier 1-on-1 masterclasses.'
    ],
    recommendedFormula: '[Acknowledge the architectural point] + [State how you plan to refactor] + [Ask 1 specific clarifying question if trade-off is unclear] + [Tag commit hash when done]',
    options: [
      {
        id: 'opt-1-flawed',
        text: '"I did raw SQL because the repository pattern is too slow and complicated for this simple feature. It works fine on my machine and tests pass."',
        verdict: 'flawed',
        seniorReaction: 'David frowns: "Request Changes" button clicked immediately. Flags you as resistant to architectural standards.',
        internalMonologue: '"Saying \'it works on my machine\' in 2026? Raw SQL bypasses our tenant-isolation middleware. This attitude creates tech debt nightmares."',
        rubricScore: { clarity: 4, seniorEmpathy: 1, actionability: 3 },
        coachingFeedback: 'Never get defensive or invoke "it works on my machine". Standardized patterns exist for security, connection pooling, and multi-tenancy, not personal preference.'
      },
      {
        id: 'opt-2-mediocre',
        text: '"Sorry David, I am so sorry for making such a stupid mistake. I am really bad at this. I will delete everything and rewrite it right now."',
        verdict: 'mediocre',
        seniorReaction: 'Feels uncomfortable and awkward. Nobody wants to deal with excessive self-flagellation in code reviews.',
        internalMonologue: '"Whoa, it\'s just a refactoring suggestion, not a moral failure. Please don\'t grovel, just split the function into smaller helpers."',
        rubricScore: { clarity: 3, seniorEmpathy: 3, actionability: 4 },
        coachingFeedback: 'Do not over-apologize or demean yourself. Maintain professional composure. A critique of code is normal engineering routine.'
      },
      {
        id: 'opt-3-senior-grade',
        text: '"Good catch David. You\'re right—the function was taking on both validation and persistence. I have extracted the validation logic into UserValidator and moved queries into UserRepository to leverage our tenant filters. Pushed refactor in commit 7c2a1. Could you double-check if the batch query approach in UserRepository:L45 aligns with what you envisioned?"',
        verdict: 'senior-grade',
        seniorReaction: 'David reviews the new commit, approves with a green checkmark and comments: "Much cleaner and safer. Approved!"',
        internalMonologue: '"Rapid iteration, zero ego, adopted the architectural pattern cleanly. I enjoy reviewing this engineer\'s PRs."',
        rubricScore: { clarity: 10, seniorEmpathy: 10, actionability: 10 },
        coachingFeedback: 'Masterclass response. You validated the principle, executed the requested fix, referenced the commit SHA, and engaged them on an architectural nuance.'
      }
    ]
  }
];
