import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIMentorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am your Senior Principal AI Mentor. 
Whether you are struggling with Python syntax, trying to understand Agentic AI without confusing jargon, or feeling nervous about how to communicate with senior engineers in your sprint, ask me anything in plain English!`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const QUICK_PROMPTS = [
    'Explain Agentic AI like I am 10 years old',
    'How do I ask my senior a question without annoying them?',
    'What is the difference between RAG and fine-tuning?',
    'I feel slower than other team members, what should I do?',
    'Give me an everyday life analogy for Python Dictionaries',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          context: 'Student LMS Mentorship & Plain Understanding',
          scenarioTitle: 'Fresher AI and Behavioral Guidance',
          role: 'Staff Principal Engineer & Mentor',
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.response || 'I am here to help you accelerate!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: getLocalTutorResponse(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalTutorResponse = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('10 years old') || lower.includes('agentic')) {
      return `### Agentic AI Explained for a 10-Year-Old
Imagine you have a smart talking parrot (a standard Chatbot). You say "Parrot, I'm hungry", and the parrot squawks "Pizza is delicious!". But it can't feed you.

Now imagine you have a helpful robot butler (an **Agentic AI**). You say "Robot, I'm hungry". 
The robot:
1. **Plans**: Checks your fridge to see what ingredients you have.
2. **Uses Tools**: Opens the pantry, turns on the oven, rolls the dough.
3. **Observes & Checks**: Sniffs the pizza after 10 minutes to make sure it's not burnt!
4. **Delivers**: Serves you a fresh slice.

That is Agentic AI: an AI that has tools, makes plans, checks its own work, and gets real things done in the world!`;
    }

    if (lower.includes('senior') || lower.includes('annoying') || lower.includes('question')) {
      return `### How to Ask Seniors Questions (The Secret Cheat Code)
Seniors are **never** annoyed by questions. What exhausts them is having to spend 15 minutes asking you:
- *"Did you check the logs?"*
- *"What commit are you on?"*
- *"Did you restart the server?"*

To instantly earn their respect, follow the **4-Sentence Rule**:
1. **The Goal**: *"Hey Alex, I'm working on the user export endpoint."*
2. **The Exact Blocker**: *"I'm getting a 401 error from the token service."*
3. **What I Verified**: *"I've checked the .env client ID and verified my Docker container is healthy."*
4. **My Hypothesis & Ask**: *"My hypothesis is an expired JWT signature. Do you have 2 mins or could you glance at commit \`f41a\`?"*

Notice that this takes the senior 30 seconds to answer!`;
    }

    return `### Senior Engineering Mentor Perspective
That is a great question. In fast-paced engineering teams, the freshers who excel aren't the ones who know every single syntax trick on Day 1. 

The ones who accelerate to senior levels are the ones who:
1. **Break complex problems into verifiable steps** (just like Agentic AI planners do).
2. **Show what they tried before asking for help**.
3. **Automate repetitive chores using GenAI and Python**.

Keep experimenting in the Python Lab and Gaming Arena—you are building real muscle memory!`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Deck */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <span>24/7 AI Senior Tech Lead & Tutor</span>
          <span>·</span>
          <span className="text-slate-400">Student-Friendly & Plain English</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Ask Your Personal Staff Engineer
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          No question is too simple. Ask about Python errors, Agentic loops, or how to navigate corporate communication.
        </p>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-2 ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-900 rounded-xl max-w-xs border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Senior Mentor is typing guidance...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your question or scenario in plain English... (e.g. How does RAG prevent hallucinations?)"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
