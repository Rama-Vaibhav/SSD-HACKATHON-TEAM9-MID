import React, { useState, useEffect } from "react";
import { CurrentUser } from "../hooks/CurrentUser";
import { useNavigate } from "react-router-dom";
import { db } from "../db/db";

const StudentDashboard = () => {
  const { user, loading: userLoading } = CurrentUser();
  const [classCodeInput, setClassCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const navigate = useNavigate();

  // Fetch all classes student has joined
  const fetchJoinedClasses = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await db
        .from("questions")
        .select(`id, class_id, class:classes(class_code, professor_id), question`)
        .eq("student_id", user.id);

      if (error) throw error;

      // Remove duplicates (one entry per class)
      const uniqueClassesMap = new Map();
      data.forEach((item) => {
        if (!uniqueClassesMap.has(item.class_id)) {
          uniqueClassesMap.set(item.class_id, item);
        }
      });

      setJoinedClasses(Array.from(uniqueClassesMap.values()));
    } catch (err) {
      console.error("Error fetching joined classes:", err.message);
    }
  };

  useEffect(() => {
    if (user) fetchJoinedClasses();
  }, [user]);

  const handleJoinClass = async () => {
    try {
      if (!classCodeInput) return alert("Enter class code");

      setLoading(true);

      if (!user?.id) {
        alert("User info not found");
        return;
      }

      const { data: classData, error: classError } = await db
        .from("classes")
        .select("*")
        .eq("class_code", classCodeInput)
        .single();

      if (classError || !classData) throw new Error("Class not found");

      const classId = classData.id;

      const { data: joined } = await db
        .from("questions")
        .select("*")
        .eq("class_id", classId)
        .eq("student_id", user.id)
        .limit(1);

      if (joined?.length > 0) {
        alert("You have already joined this class!");
        return;
      }

      const { error: joinError } = await db
        .from("questions")
        .insert([
          {
            class_id: classId,
            student_id: user.id,
            question: "Student joined the class",
          },
        ]);

      if (joinError) throw joinError;

      alert(`✅ Successfully joined class: ${classCodeInput}`);
      setClassCodeInput("");

      navigate(`/classroom/${classCodeInput}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
      fetchJoinedClasses();
    }
  };

  const handleLeaveClass = async (classId) => {
    try {
      if (!user?.id) return;

      setLoading(true);

      // Delete the placeholder question that marks the student in the class
      const { error } = await db
        .from("questions")
        .delete()
        .eq("class_id", classId)
        .eq("student_id", user.id)
        .eq("question", "Student joined the class");

      if (error) throw error;

      alert("✅ You have left the class");
      fetchJoinedClasses();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <p>Loading user info...</p>;
  if (!user) return <p>User not logged in.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.name}</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>Join a Class</h2>
        <input
          type="text"
          placeholder="Enter class code"
          value={classCodeInput}
          onChange={(e) => setClassCodeInput(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleJoinClass} disabled={loading}>
          {loading ? "Joining..." : "Join Class"}
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Your Joined Classes</h2>
        {joinedClasses.length === 0 ? (
          <p>You haven't joined any classes yet.</p>
        ) : (
          <ul>
            {joinedClasses.map((item) => (
              <li key={item.class_id} style={{ marginBottom: "10px" }}>
                Class Code: <strong>{item.class.class_code}</strong>{" "}
                {item.class.professor_id && `(Professor ID: ${item.class.professor_id})`}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleLeaveClass(item.class_id)}
                  disabled={loading}
                >
                  Leave Class
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
