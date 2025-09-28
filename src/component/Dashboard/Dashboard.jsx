import React, { useEffect, useState } from "react";
import { CurrentUser } from "../../hooks/CurrentUser";
import { db } from "../../db/db";
import CreateClass from "../CreateClass/CreateClass";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = CurrentUser();
  const [classes, setClasses] = useState([]);
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

      // Remove from local state
      setClasses((prev) => prev.filter((cls) => cls.id !== classId));
    } catch (err) {
      console.error("Error deleting class:", err.message);
      alert("Failed to delete class");
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>No user logged in.</p>;
  if (user.role !== "Professor")
    return <p>Only Professors can access this page.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>

      {/* Create Class Button */}
      <CreateClass user={user} />

      {/* List of Classes */}
      <h2 style={{ marginTop: "30px" }}>Your Classes</h2>
      {classes.length === 0 ? (
        <p>No classes created yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                width: "200px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div onClick={() => navigate(`/professor/class/${cls.class_code}`)}>
                <h3>Class</h3>
                <p>
                  <strong>Code:</strong> {cls.class_code}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(cls.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                style={{
                  marginTop: "10px",
                  padding: "5px",
                  background: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
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
