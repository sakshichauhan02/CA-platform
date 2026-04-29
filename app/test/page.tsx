"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Loader2, CheckCircle2, Clock, Check } from "lucide-react";

type Question = {
  id: string | number;
  question_text?: string;
  question?: string;
  content?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  topic: string;
};

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string | number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30:00 minutes
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  // Helper to get question text
  const getQuestionText = (q: Question) => {
    return q.question_text || q.question || q.content || "Question text not found";
  };

  // Fetch all questions
  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) {
        console.error("Error fetching questions:", error);
      } else if (data) {
        setQuestions(data);
      }
      setLoading(false);
    }
    loadQuestions();
  }, [supabase]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (option: string) => {
    const qId = questions[currentIndex]?.id;
    if (!qId) return;
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let totalCorrect = 0;
    const topicScores: Record<string, number> = {};

    console.log("--- SUBMISSION DEBUG START ---");
    console.log("Selected Answers State (by ID):", selectedAnswers);
    console.log("Total Questions:", questions.length);

    // Initialize all unique topics to 0
    questions.forEach(q => {
      if (q.topic) topicScores[q.topic] = 0;
    });

    questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correct_answer?.trim().toLowerCase();
      
      console.log(`Q${index + 1} [ID:${q.id}]: User[${userAnswer}] vs Correct[${correctAnswer}]`);

      if (userAnswer === correctAnswer && userAnswer !== undefined) {
        totalCorrect++;
        if (q.topic) {
          topicScores[q.topic] = (topicScores[q.topic] || 0) + 1;
        }
      }
    });

    console.log("Final Calculated Score:", totalCorrect);
    console.log("Topic Scores Breakdown:", topicScores);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Submission failed: No user authenticated");
        window.location.href = "/login";
        return;
      }

      const payload = {
        user_id: user.id,
        total_score: totalCorrect,
        topic_scores: topicScores,
      };

      console.log("Payload to Supabase:", payload);

      const { data, error } = await supabase.from("test_results").insert([payload]).select();

      if (error) {
        console.error("Supabase Insert Error:", error);
        alert(`Error saving result: ${error.message}`);
        throw error;
      }

      console.log("Result saved successfully:", data);
      console.log("--- SUBMISSION DEBUG END ---");
      
      window.location.href = "/results"; 
    } catch (err: any) {
      console.error("Full Submission Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-slate-500">No questions found.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, i) => {
              const isCurrent = currentIndex === i;
              const isAnswered = selectedAnswers[questions[i].id] !== undefined;
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                    ${isCurrent 
                      ? 'bg-primary text-white ring-4 ring-primary/10 scale-105' 
                      : isAnswered 
                        ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                        : 'bg-slate-50 text-slate-500 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-auto p-6 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Active Question</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <span>Not Visited</span>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-700">
              Question <span className="text-primary">{currentIndex + 1}</span> of {questions.length}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 flex flex-col items-center">
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-10">
                <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    {currentQuestion.topic || "Accounting Standards"}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight text-slate-800">
                    {getQuestionText(currentQuestion)}
                  </h1>
                </div>

                {/* Options Grid */}
                <div className="grid gap-4">
                  {['A', 'B', 'C', 'D'].map((label) => {
                    const key = `option_${label.toLowerCase()}` as keyof Question;
                    const isSelected = selectedAnswers[currentQuestion.id] === label;
                    
                    return (
                      <button
                        key={label}
                        onClick={() => handleSelect(label)}
                        className={`group flex items-center w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden
                          ${isSelected 
                            ? 'border-primary bg-primary/[0.02] text-primary shadow-xl shadow-primary/5' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-700'
                          }`}
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 mr-6 font-bold transition-all duration-500
                          ${isSelected 
                            ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                            : 'border-slate-200 bg-white group-hover:border-slate-300'
                          }`}
                        >
                          {label}
                        </div>
                        <span className={`text-lg font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                          {currentQuestion[key]}
                        </span>
                        
                        {isSelected && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-primary text-white p-1 rounded-full animate-in zoom-in">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="mt-12 flex justify-end pb-12">
              {currentIndex < questions.length - 1 ? (
                <Button 
                  size="lg" 
                  onClick={handleNext}
                  className="group px-12 py-8 text-xl font-bold rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Next Question
                  <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-16 py-8 text-xl font-bold rounded-[1.5rem] bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-200 hover:shadow-green-400 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Submit Final Test"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
