import React, { useState } from "react";
import { db } from "../../db/db.js";
import "./CreateClass.css";

const CreateClass = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [classCode, setClassCode] = useState("");

  const handleCreateClass = async () => {
    try {
      setLoading(true);
      if (!user || !user.id) {
        alert("User information not found.");
        return;
      }
      
      const { data, error } = await db
        .from("classes")
        .insert([{ professor_id: user.id }])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Class not created");

      setClassCode(data[0].class_code);
    } catch (err) {
      console.error("Error creating class:", err);
      alert(err.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-class-container">
      <h2>Create a New Class</h2>
      <button onClick={handleCreateClass} disabled={loading}>
        {loading ? "Creating..." : "Create Class"}
      </button>

      {classCode && (
        <p className="class-code-message">
          ✅ Class Created! Share this code: <strong>{classCode}</strong>
        </p>
      )}
    </div>
  );
};

export default CreateClass;
