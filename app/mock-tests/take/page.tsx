"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Loader2, CheckCircle2, Clock, Check } from "lucide-react";
import Link from "next/link";

// Types for Question
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
};

export default function TakeTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string | number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30:00 in seconds
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const supabase = createClient();

  // Helper to get question text from various possible column names
  const getQuestionText = (q: Question) => {
    return q.question_text || q.question || q.content || "Question text not found";
  };

  // Fetch questions from Supabase
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .limit(15);

        if (error) {
          console.error("Error fetching questions:", error);
        } else if (data && data.length > 0) {
          console.log("Fetched questions:", data);
          setQuestions(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [supabase]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionClick = (option: string) => {
    const qId = questions[currentIndex]?.id;
    if (!qId) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true); 
    let totalCorrect = 0;
    const topicScores: Record<string, number> = {};

    console.log("--- SUBMISSION DEBUG START ---");
    console.log("Questions Array:", questions);
    console.log("User Selected Answers (by ID):", selectedAnswers);

    // Initialize topics with correct and total counts
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach(q => {
      const topic = (q as any).topic || "General";
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[topic].total++;
    });

    // Score calculation
    questions.forEach((q, idx) => {
      const userAnswer = String(selectedAnswers[q.id] || "").trim().toLowerCase();
      const correctAnswer = String(q.correct_answer || "").trim().toLowerCase();
      
      const topic = (q as any).topic || "General";
      if (userAnswer === correctAnswer && userAnswer !== "") {
        totalCorrect++;
        topicBreakdown[topic].correct++;
      }
    });

    console.log("Correct Count Calculated:", totalCorrect);
    console.log("Topic Breakdown:", topicBreakdown);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No user found for submission");
        window.location.href = "/login";
        return;
      }

      const payload = {
        user_id: user.id,
        total_score: totalCorrect,
        total_questions: questions.length,
        topic_scores: topicBreakdown,
      };

      console.log("Payload to Supabase:", payload);

      const { data, error } = await supabase
        .from("test_results")
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase Error during insert:", error);
        alert(`Failed to save results: ${error.message}`);
        throw error;
      }

      console.log("Successfully saved results:", data);
      console.log("--- SUBMISSION DEBUG END ---");
      
      window.location.href = "/results"; 
    } catch (err: any) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Loader2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Questions Found</h2>
          <p className="text-slate-500 mb-6">We couldn't find any questions in your "questions" table.</p>
          <Button asChild variant="outline">
            <Link href="/mock-tests">Go Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Submitted!</h2>
          <p className="text-slate-500 mb-8 text-lg">Congratulations on completing the mock test.</p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full text-lg rounded-xl">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden selection:bg-primary/10">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shadow-sm shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, i) => {
              const isCurrent = currentIndex === i;
              const isAnswered = selectedAnswers[questions[i].id] !== undefined;
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                    ${isCurrent 
                      ? 'bg-primary text-white ring-4 ring-primary/10 scale-105 shadow-lg shadow-primary/20' 
                      : isAnswered 
                        ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200' 
                        : 'bg-slate-50 text-slate-500 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-auto p-8 space-y-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="h-4 w-4 rounded-lg bg-primary shadow-sm" />
            <span>Active Question</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="h-4 w-4 rounded-lg bg-green-500 shadow-sm" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="h-4 w-4 rounded-lg bg-slate-200 shadow-sm" />
            <span>Not Visited</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Assessment Mode</span>
            <h2 className="text-lg font-bold text-slate-700">
              Question <span className="text-primary">{currentIndex + 1}</span> of {totalQuestions}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-slate-800">
            <Clock className={`h-5 w-5 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-primary'}`} />
            <span className={`text-xl font-bold font-mono tracking-tighter ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1 z-10">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col items-center">
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Question Card */}
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 md:p-14">
                <div className="mb-12">
                  <span className="inline-block px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/5">
                    Question {currentIndex + 1}
                  </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-800 tracking-tight">
                    {getQuestionText(currentQuestion)}
                  </h1>
                </div>

                {/* Answer Options */}
                <div className="grid gap-5">
                  {['A', 'B', 'C', 'D'].map((label) => {
                    const optionKey = `option_${label.toLowerCase()}` as keyof Question;
                    const optionText = currentQuestion[optionKey];
                    const isSelected = selectedAnswers[currentQuestion.id] === label;
                    
                    return (
                      <button
                        key={label}
                        onClick={() => handleOptionClick(label)}
                        className={`group flex items-center w-full p-6 md:p-7 rounded-[1.5rem] border-2 transition-all duration-300 text-left relative overflow-hidden
                          ${isSelected 
                            ? 'border-primary bg-primary/[0.02] text-primary shadow-xl shadow-primary/5' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-700'
                          }`}
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 mr-6 font-bold transition-all duration-500
                          ${isSelected 
                            ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                            : 'border-slate-200 bg-white group-hover:border-slate-300'
                          }`}
                        >
                          {label}
                        </div>
                        <span className={`text-lg md:text-xl font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                          {optionText}
                        </span>
                        
                        {isSelected && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full animate-in zoom-in spin-in-90 duration-300">
                            <Check className="h-4 w-4 stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="mt-12 flex justify-between items-center pb-20">
              {currentIndex > 0 ? (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-10 py-8 text-lg font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-x-1"
                >
                  <ChevronRight className="mr-2 h-5 w-5 rotate-180" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentIndex < totalQuestions - 1 ? (
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
                  className="px-16 py-8 text-xl font-bold rounded-[1.5rem] bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-200 hover:shadow-green-400 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Submit Final Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
