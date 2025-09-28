import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { db } from "../../db/db";

const socket = io("http://localhost:5000");

const Questions = ({ classCode }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!classCode) return;

    // 1️⃣ Join the class room
    socket.emit("joinClass", classCode);

    // 2️⃣ Fetch existing questions from Supabase
    const fetchQuestions = async () => {
      try {
        const { data: classData } = await db
          .from("classes")
          .select("id")
          .eq("class_code", classCode)
          .single();

        if (!classData) return;

        const { data: questionsData } = await db
          .from("questions")
          .select("id, question, student_id")
          .eq("class_id", classData.id)
          .order("created_at", { ascending: true });

        // Map to include student name (optional)
        const mapped = questionsData.map((q) => ({
          ...q,
          student: "Student", // optionally fetch student name from user_details
        }));

        setQuestions(mapped);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchQuestions();

    // 3️⃣ Listen for new questions
    socket.on("newQuestion", (q) => {
      if (q.classCode === classCode) {
        setQuestions((prev) => [...prev, q]);
      }
    });

    // Cleanup
    return () => {
      socket.emit("leaveClass", classCode);
      socket.off("newQuestion");
    };
  }, [classCode]);

  return (
    <div>
      <h3>Questions for Class {classCode}</h3>
      {questions.length === 0 ? (
        <p>No questions yet...</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.id}>
              <b>{q.student}:</b> {q.question}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Questions;
