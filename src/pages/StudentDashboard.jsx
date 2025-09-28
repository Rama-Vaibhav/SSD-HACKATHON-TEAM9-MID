import React, { useState, useEffect } from "react";
import { CurrentUser } from "../hooks/CurrentUser";
import { useNavigate } from "react-router-dom";
import { db } from "../db/db";
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, loading: userLoading } = CurrentUser();
  const [classCodeInput, setClassCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const navigate = useNavigate();

  const fetchJoinedClasses = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await db
        .from("questions")
        .select(`id, class_id, class:classes(class_code, professor_id), question`)
        .eq("student_id", user.id);
      if (error) throw error;

      const uniqueClassesMap = new Map();
      data.forEach(item => {
        if (!uniqueClassesMap.has(item.class_id)) uniqueClassesMap.set(item.class_id, item);
      });
      setJoinedClasses(Array.from(uniqueClassesMap.values()));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => { if(user) fetchJoinedClasses(); }, [user]);

  const handleJoinClass = async () => {
    if (!classCodeInput) return alert("Enter class code");
    setLoading(true);
    try {
      if (!user?.id) throw new Error("User info not found");
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
      if (joined?.length > 0) throw new Error("You have already joined this class!");

      const { error: joinError } = await db.from("questions").insert([
        { class_id: classId, student_id: user.id, question: "Student joined the class" }
      ]);
      if (joinError) throw joinError;

      alert(`✅ Successfully joined class: ${classCodeInput}`);
      setClassCodeInput("");
      navigate(`/classroom/${classCodeInput}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      fetchJoinedClasses();
    }
  };

  const handleLeaveClass = async (classId) => {
    setLoading(true);
    try {
      const { error } = await db.from("questions").delete()
        .eq("class_id", classId)
        .eq("student_id", user.id)
        .eq("question", "Student joined the class");
      if (error) throw error;
      fetchJoinedClasses();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  if (userLoading) return <p className="loading-msg">Loading user info...</p>;
  if (!user) return <p className="loading-msg">User not logged in.</p>;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Manage your classes and join new sessions seamlessly</p>
      </header>

      {/* Join Class Card */}
      <div className="join-class-card">
        <input
          type="text"
          placeholder="Enter Class Code"
          value={classCodeInput}
          onChange={(e) => setClassCodeInput(e.target.value)}
        />
        <button onClick={handleJoinClass} disabled={loading}>
          {loading ? "Joining..." : "Join Class"}
        </button>
      </div>

      {/* Joined Classes Section */}
      <section className="joined-classes-section">
        <h2>Your Joined Classes</h2>
        {joinedClasses.length === 0 ? (
          <div className="empty-state">
            <p>No classes joined yet</p>
            <span>Use the code above to join your first class 🚀</span>
          </div>
        ) : (
          <div className="classes-grid">
            {joinedClasses.map((item) => (
              <div className="class-card" key={item.class_id}>
                <div className="class-info">
                  <h3>{item.class.class_code}</h3>
                  {item.class.professor_id && <span>Professor ID: {item.class.professor_id}</span>}
                </div>
                <div className="class-actions">
                  <button onClick={() => navigate(`/classroom/${item.class.class_code}`)}>
                    Enter
                  </button>
                  <button className="leave-btn" onClick={() => handleLeaveClass(item.class_id)}>
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
