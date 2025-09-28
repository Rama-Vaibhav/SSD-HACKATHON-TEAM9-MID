import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { db } from "../../db/db";
import './question.css';

const socket = io("http://localhost:5000");

const Questions = ({ classCode }) => {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("All"); // Filter state

  useEffect(() => {
    if (!classCode) return;

    socket.emit("joinClass", classCode);

    const fetchQuestions = async () => {
      try {
        const { data, error } = await db
          .from("professor_dashboard")
          .select("*")
          .eq("class_code", classCode)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setQuestions(data || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchQuestions();

    socket.on("newQuestion", (q) => {
      if (q.classCode === classCode) setQuestions(prev => [...prev, q]);
    });

    socket.on("updateQuestion", (updatedQ) => {
      setQuestions(prev =>
        prev.map(q => q.question_id === updatedQ.question_id ? updatedQ : q)
      );
    });

    return () => {
      socket.emit("leaveClass", classCode);
      socket.off("newQuestion");
      socket.off("updateQuestion");
    };
  }, [classCode]);

  // Toggle importance or status
  const toggleField = async (questionId, field) => {
    const question = questions.find(q => q.question_id === questionId);
    if (!question) return;

    const newValue =
      field === "importance"
        ? question.importance === "Important" ? "Unimportant" : "Important"
        : question.status === "Answered" ? "Unanswered" : "Answered";

    try {
      const { data, error } = await db
        .from("questions")
        .update({ [field]: newValue })
        .eq("id", questionId)
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev =>
        prev.map(q => q.question_id === questionId ? { ...q, [field]: newValue } : q)
      );

      socket.emit("updateQuestion", { ...data, classCode });
    } catch (err) {
      console.error(err.message);
    }
  };

  // Apply filter
  const filteredQuestions = questions.filter(q => {
    if (filter === "All") return true;
    return q.status === filter;
  });

  return (
    <div className="questions-wrapper">
      <h2 className="title">Class {classCode} Questions</h2>

      {/* Filter dropdown */}
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Unanswered">Unanswered</option>
          <option value="Answered">Answered</option>
        </select>
      </div>

      <br />

      {filteredQuestions.length === 0 ? (
        <p className="no-questions">No questions match the selected filter.</p>
      ) : (
        <div className="questions-grid">
          {filteredQuestions.map(q => (
            <div
              key={q.question_id}
              className={`question-card ${q.status.toLowerCase()}`}
            >
              {q.importance === "Important" && <div className="star">★</div>}
              <div className="question-text">
                <span className="student-name">{q.student_name}:</span>
                {q.question}
              </div>
              <div className="tags">
                <span
                  className={`tag importance ${q.importance.toLowerCase()}`}
                  onClick={() => toggleField(q.question_id, "importance")}
                >
                  {q.importance}
                </span>
                <span
                  className={`tag status ${q.status.toLowerCase()}`}
                  onClick={() => toggleField(q.question_id, "status")}
                >
                  {q.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
