// src/pages/ClassRoom/ClassRoom.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CurrentUser } from "../../hooks/CurrentUser";
import { db } from "../../db/db";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // connect to backend

const ClassRoom = () => {
  const { user, loading: userLoading } = CurrentUser();
  const { classCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    if (!user) return;

    // Join class socket room
    socket.emit("joinClass", classCode);

    // Listen for new questions
    socket.on("newQuestion", (q) => {
      if (q.classCode === classCode) {
        setQuestions((prev) => [...prev, q]);
      }
    });

    // Fetch existing questions from Supabase
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
          .select("id, question, student_id, created_at")
          .eq("class_id", classData.id);

        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error("Error fetching questions:", err.message);
      }
    };

    fetchQuestions();

    return () => {
      socket.off("newQuestion");
    };
  }, [user, classCode]);

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      // Get class info
      const { data: classData } = await db
        .from("classes")
        .select("id")
        .eq("class_code", classCode)
        .single();

      if (!classData) return;

      // Insert into Supabase
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

      // Emit via socket to professor dashboard
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
    <div style={{ padding: "20px" }}>
      <h1>Class Room: {classCode}</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>Ask a Question</h2>
        <input
          type="text"
          placeholder="Type your question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ marginRight: "10px", width: "300px" }}
        />
        <button onClick={handleAskQuestion}>Ask</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Questions in this Class</h2>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul>
            {questions.map((q) => (
              <li key={q.id || Math.random()}>
                {q.question}{" "}
                {q.student_id === user.id && <strong>(You)</strong>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClassRoom;
