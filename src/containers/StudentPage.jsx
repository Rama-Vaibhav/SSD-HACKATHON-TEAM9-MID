import React, { useState } from "react";
import axios from "axios";

const StudentPage = () => {
  const [studentName, setStudentName] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/questions", {
        student_name: studentName,
        question,
      });

      console.log("Question submitted:", data);
      setStudentName("");
      setQuestion("");
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Your Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentPage;
