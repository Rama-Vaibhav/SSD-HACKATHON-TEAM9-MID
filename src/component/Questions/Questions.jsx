import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { db } from "../../db/db";

const socket = io("http://localhost:5000");

const Questions = ({ classCode }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!classCode) return;

    // Join class room
    socket.emit("joinClass", classCode);

    // Fetch existing questions from professor_dashboard view
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
        console.error("Error fetching questions:", err.message);
      }
    };

    fetchQuestions();

    // Listen for new questions and updates via Socket.IO
    socket.on("newQuestion", (q) => {
      if (q.classCode === classCode) {
        setQuestions((prev) => [...prev, q]);
      }
    });

    socket.on("updateQuestion", (updatedQ) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === updatedQ.question_id ? updatedQ : q
        )
      );
    });

    return () => {
      socket.emit("leaveClass", classCode);
      socket.off("newQuestion");
      socket.off("updateQuestion");
    };
  }, [classCode]);

  // Update importance or status
  const toggleField = async (questionId, field) => {
    const question = questions.find((q) => q.question_id === questionId);
    if (!question) return;

    const newValue =
      field === "importance"
        ? question.importance === "Important"
          ? "Unimportant"
          : "Important"
        : question.status === "Answered"
        ? "Unanswered"
        : "Answered";

    try {
      const { data, error } = await db
        .from("questions")
        .update({ [field]: newValue })
        .eq("id", questionId)
        .select()
        .single();

      if (error) throw error;

      // Update frontend state
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === questionId ? { ...q, [field]: newValue } : q
        )
      );

      socket.emit("updateQuestion", { ...data, classCode });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h3>Questions for Class {classCode}</h3>
      {questions.length === 0 ? (
        <p>No questions yet...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {questions.map((q) => (
            <li
              key={q.question_id}
              style={{
                marginBottom: "12px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <div>
                <b>{q.student_name}:</b> {q.question}
              </div>
              <div style={{ marginTop: "6px" }}>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor:
                      q.importance === "Important" ? "#ffcccc" : "#e0e0e0",
                    color: q.importance === "Important" ? "#900" : "#555",
                    fontSize: "12px",
                    marginRight: "8px",
                  }}
                >
                  {q.importance || "Unimportant"}
                </span>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor:
                      q.status === "Answered" ? "#ccffcc" : "#f0f0f0",
                    color: q.status === "Answered" ? "#090" : "#555",
                    fontSize: "12px",
                  }}
                >
                  {q.status || "Unanswered"}
                </span>
              </div>
              {/* Always show toggle buttons since only professors access this */}
              <div style={{ marginTop: "6px" }}>
                <button
                  onClick={() => toggleField(q.question_id, "importance")}
                  style={{ marginRight: "5px" }}
                >
                  Toggle Importance
                </button>
                <button onClick={() => toggleField(q.question_id, "status")}>
                  Toggle Status
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Questions;
