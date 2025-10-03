
import React, { useEffect, useState } from "react";
import { db } from "../../db/db";
import { CurrentUser } from "../../hooks/CurrentUser";
import "./TADashboard.css"; // Import CSS file

const TaDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = CurrentUser();
  const taEmail = user?.email;

  const fetchQuestions = async () => {
    if (!taEmail) return;

    setLoading(true);
    const { data, error } = await db
      .from("questions")
      .select("*")
      .eq("ta_email", taEmail)
      .eq("importance", "Important")
      .eq("status", "Unanswered");

    if (error) {
      console.error("Error fetching TA Dashboard:", error.message);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [taEmail]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">TA Dashboard</h1>

      {loading ? (
        <p className="loading-text">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="empty-text">No important unanswered questions 🎉</p>
      ) : (
        <div className="questions-grid">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <p className="question-text">{q.question}</p>
              <p className="student-info">Asked by: {q.student_id}</p>
              <p className="class-info">Class ID: {q.class_id}</p>
              <div className="tags">
                <span className="tag importance">{q.importance}</span>
                <span className="tag status">{q.status}</span>
              </div>
              <p className="timestamp">
                {new Date(q.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaDashboard;

