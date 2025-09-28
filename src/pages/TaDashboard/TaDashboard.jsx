// src/pages/ClassRoom/ClassRoom.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CurrentUser } from "../../hooks/CurrentUser";
import { db } from "../../db/db";
import './TADashboard.css'
import io from "socket.io-client";
const socket = io("http://localhost:5000"); // connect to backend

const ClassRoom = () => {
  const { user, loading: userLoading } = CurrentUser();
  const { classCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  // Fetch questions
  useEffect(() => {
    if (!user) return;

    const fetchQuestions = async () => {
      try {
        const { data: classData } = await db
          .from("classes")
          .select("id")
          .eq("class_code", classCode)
          .single();

        if (!classData) return;

        const { data, error } = await db
          .from("questions")
          .select(`
            id, question, student_id, created_at,
            student:student_id(name, email)
          `)
          .eq("class_id", classData.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error("Error fetching questions:", err.message);
      }
    };

    fetchQuestions();

    // Join socket room
    socket.emit("joinClass", classCode);

    socket.on("newQuestion", (q) => {
      if (q.classCode === classCode) setQuestions(prev => [...prev, q]);
    });

    return () => {
      socket.off("newQuestion");
      socket.emit("leaveClass", classCode);
    };
  }, [user, classCode]);

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      const { data: classData } = await db
        .from("classes")
        .select("id")
        .eq("class_code", classCode)
        .single();

      if (!classData) return;

      const { data: inserted, error } = await db
        .from("questions")
        .insert([
          {
            class_id: classData.id,
            student_id: user.id,
            question: newQuestion,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      socket.emit("askQuestion", {
        ...inserted,
        classCode,
        student: user.name || user.email,
      });

      setNewQuestion("");
    } catch (err) {
      console.error("Error asking question:", err.message);
    }
  };

  if (userLoading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in.</p>;

  return (
    <div className="classroom-container">
      <h1 className="classroom-title">Class Room: {classCode}</h1>

      <div className="ask-section">
        <input
          type="text"
          placeholder="Type your question here..."
          className="question-input"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button className="ask-btn" onClick={handleAskQuestion}>
          Ask
        </button>
      </div>

      <div className="questions-section">
        <h2>Questions in this Class</h2>
        {questions.length === 0 ? (
          <p className="no-questions">No questions yet. Be the first to ask!</p>
        ) : (
          <div className="questions-grid">
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <div className="question-text">{q.question}</div>
                <div className="student-tag">
                  {q.student?.name || "Anonymous"} ({q.student?.email || "No Email"})
                </div>
                <div className="question-footer">
                  <span className="importance important">Important</span>
                  <span className="status unanswered">Unanswered</span>
                  <span style={{ fontSize: "0.75rem", color: "#555", float: "right" }}>
                    {new Date(q.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassRoom;
