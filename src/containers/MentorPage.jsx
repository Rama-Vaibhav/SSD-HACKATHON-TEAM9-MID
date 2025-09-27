import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const MentorPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch existing questions
    const fetchQuestions = async () => {
      const { data } = await axios.get("http://localhost:5000/questions");
      setQuestions(data);
    };
    fetchQuestions();

    // Listen for new questions
    socket.on("new-question", (q) => {
      setQuestions((prev) => [...prev, q]);
    });

    return () => {
      socket.off("new-question");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mentor Page</h2>
      {questions.map((q) => (
        <div
          key={q.id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <strong>{q.student_name}</strong>: {q.question}
        </div>
      ))}
    </div>
  );
};

export default MentorPage;
