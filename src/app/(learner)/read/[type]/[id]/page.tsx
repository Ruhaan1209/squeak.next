"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNewsAPI } from "@/hooks/useNewsAPI";
import { useStoryAPI } from "@/hooks/useStoryAPI";
import { useQnaAPI } from "@/hooks/useQnaAPI";
import { useProgressAPI } from "@/hooks/useProgressAPI";
import ReactMarkdown from "react-markdown";
import type { GetNewsResponse, GetStoryPageResponse } from "@/types";

export default function ReadPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const { getNews } = useNewsAPI();
  const { getStory } = useStoryAPI();
  const { getQuestion, evaluateQnA } = useQnaAPI();
  const { incrementProgress } = useProgressAPI();

  const [content, setContent] = useState<GetNewsResponse | GetStoryPageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<{ evaluation: string; explanation: string } | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (type === "News") {
          const data = await getNews(id);
          setContent(data);
        } else {
          const data = await getStory({ id, page: String(currentPage) });
          setContent(data);
        }
      } catch (err) {
        console.error("Failed to load content:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, id, currentPage, getNews, getStory]);

  const handleGetQuestion = async (questionType: "vocab" | "understanding") => {
    if (!content) return;
    setQuestionLoading(true);
    setEvaluation(null);
    setAnswer("");
    try {
      const data = await getQuestion({
        id, content_type: type, cefr_level: content.cefr_level, question_type: questionType,
      });
      setQuestion(data.question);
    } catch (err) {
      console.error("Failed to get question:", err);
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!content || !question || !answer) return;
    setQuestionLoading(true);
    try {
      const data = await evaluateQnA({
        question, answer, content: content.content, cefr: content.cefr_level,
      });
      setEvaluation(data);
      if (data.evaluation === "PASS") {
        await incrementProgress(1);
      }
    } catch (err) {
      console.error("Failed to evaluate:", err);
    } finally {
      setQuestionLoading(false);
    }
  };

  const totalPages = content && "pages" in content ? content.pages : 1;

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" /></div>;
  if (!content) return <div className="text-center py-12 font-secondary">Content not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.push("/learn")} className="mb-4 text-sm font-secondary text-text-secondary hover:text-text-primary cursor-pointer border-none bg-transparent">&larr; Back to Learn</button>

      <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-secondary px-2 py-0.5 rounded-full bg-cefr-b-bg text-cefr-b-text">{content.cefr_level}</span>
          <span className="text-xs font-secondary text-text-secondary">{content.topic}</span>
          <span className="text-xs font-secondary text-text-secondary">{content.language}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-primary mb-6">{content.title}</h1>
        <div className="prose prose-lg max-w-none font-secondary">
          <ReactMarkdown>{content.content}</ReactMarkdown>
        </div>
      </div>

      {/* Pagination for stories */}
      {type === "Story" && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none disabled:opacity-50">Previous</button>
          <span className="font-secondary text-sm text-text-secondary">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none disabled:opacity-50">Next</button>
        </div>
      )}

      {/* Q&A Section */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-primary mb-4">Practice Questions</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => handleGetQuestion("vocab")} disabled={questionLoading}
            className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none hover:bg-selected transition-colors disabled:opacity-50">Vocabulary</button>
          <button onClick={() => handleGetQuestion("understanding")} disabled={questionLoading}
            className="px-4 py-2 rounded-xl bg-item-background font-secondary text-sm cursor-pointer border-none hover:bg-selected transition-colors disabled:opacity-50">Understanding</button>
        </div>

        {question && (
          <div className="space-y-4">
            <p className="font-secondary text-base">{question}</p>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..."
              className="w-full p-3 rounded-xl border border-border font-secondary text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-selected" />
            <button onClick={handleEvaluate} disabled={questionLoading || !answer}
              className="px-6 py-2 rounded-xl bg-selected text-black font-secondary text-sm cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-50">
              {questionLoading ? "Evaluating..." : "Submit Answer"}
            </button>
          </div>
        )}

        {evaluation && (
          <div className={`mt-4 p-4 rounded-xl ${evaluation.evaluation === "PASS" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            <p className="font-secondary font-medium">{evaluation.evaluation === "PASS" ? "Correct!" : "Not quite right"}</p>
            <p className="font-secondary text-sm mt-1">{evaluation.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
