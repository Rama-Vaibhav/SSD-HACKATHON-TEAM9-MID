import React, { useEffect, useState } from "react";
import { CurrentUser } from "../../hooks/CurrentUser";
import { db } from "../../db/db";
import CreateClass from "../CreateClass/CreateClass";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading } = CurrentUser();
  const [classes, setClasses] = useState([]);
  const [taEmail, setTaEmail] = useState(""); // For assigning TA
  const [selectedClass, setSelectedClass] = useState(null); // Track which class input is active
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      try {
        const { data, error } = await db
          .from("classes")
          .select("*")
          .eq("professor_id", user.id);

        if (error) throw error;
        setClasses(data || []);
      } catch (err) {
        console.error("Error fetching classes:", err.message);
      }
    };

    fetchClasses();
  }, [user]);

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const { error } = await db.from("classes").delete().eq("id", classId);
      if (error) throw error;
      setClasses((prev) => prev.filter((cls) => cls.id !== classId));
    } catch (err) {
      console.error("Error deleting class:", err.message);
      alert("Failed to delete class");
    }
  };

  // Assign TA to all Important & Unanswered questions of a class
  const handleAssignTA = async (clsId) => {
    if (!taEmail) return alert("Enter TA email");

    try {
      const { error } = await db
        .from("questions")
        .update({ ta_email: taEmail })        // Assign TA email
        .eq("class_id", clsId)
        .eq("importance", "Important")
        .eq("status", "Unanswered");

      if (error) throw error;

      alert(`✅ Assigned all Important & Unanswered questions to TA: ${taEmail}`);
      setTaEmail("");
      setSelectedClass(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>No user logged in.</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}</h1>
      <CreateClass user={user}/>

      <h2 className="classes-title">Your Classes</h2>

      {classes.length === 0 ? (
        <p className="no-classes">No classes created yet.</p>
      ) : (
        <div className="classes-container">
          {classes.map((cls) => (
            <div key={cls.id} className="class-card">
              <div
                className="class-card-header"
                onClick={() => navigate(`/professor/class/${cls.class_code}`)}
              >
                <h3>Class</h3>
                <p><strong>Code:</strong> {cls.class_code}</p>
                <p><strong>Created:</strong> {new Date(cls.created_at).toLocaleDateString()}</p>
              </div>

              {/* Assign TA Section */}
              <div className="assign-ta-container">
                <input
                  type="email"
                  placeholder="Enter TA email"
                  value={selectedClass === cls.id ? taEmail : ""}
                  onChange={(e) => {
                    setSelectedClass(cls.id);
                    setTaEmail(e.target.value);
                  }}
                />
                <button onClick={() => handleAssignTA(cls.id)}>Assign TA</button>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDeleteClass(cls.id)}
              >
                Delete Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
