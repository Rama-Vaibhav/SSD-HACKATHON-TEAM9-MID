import React, { useState } from "react";
import { db } from "../../db/db.js";

const JoinRoom = ({ user }) => {
  const [classCodeInput, setClassCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async () => {
    try {
      setLoading(true);

      if (!user || !user.id) {
        alert("User info not found");
        return;
      }

      // 1. Check if class exists
      const { data: classData, error: classError } = await db
        .from("classes")
        .select("*")
        .eq("class_code", classCodeInput)
        .single();

      if (classError || !classData) {
        throw new Error("Class not found");
      }

      const classId = classData.id;

      // 2. Check if student already joined
      const { data: questionCheck } = await db
        .from("questions")
        .select("*")
        .eq("class_id", classId)
        .eq("student_id", user.id)
        .limit(1);

      if (questionCheck && questionCheck.length > 0) {
        alert("You have already joined this class!");
        return;
      }

      // Optional: Insert a placeholder or enrollment record
      const { error: joinError } = await db
        .from("questions")
        .insert([
          {
            class_id: classId,
            student_id: user.id,
            question: "Student joined the class", // placeholder
          },
        ]);

      if (joinError) throw joinError;

      alert(`✅ Successfully joined class: ${classCodeInput}`);
      setClassCodeInput("");

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Join Class</h2>
      <input
        type="text"
        placeholder="Enter class code"
        value={classCodeInput}
        onChange={(e) => setClassCodeInput(e.target.value)}
      />
      <button onClick={handleJoinClass} disabled={loading}>
        {loading ? "Joining..." : "Join Class"}
      </button>
    </div>
  );
};

export default JoinRoom;
