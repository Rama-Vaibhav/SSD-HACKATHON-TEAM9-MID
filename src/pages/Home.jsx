
import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="app-title">Vidya Vichar</h1>
        <p className="tagline">
          A collaborative platform where students can ask questions without
          interrupting the class. Professors can answer at their pace, and
          important unanswered queries are seamlessly sent to Teaching
          Assistants.
        </p>

        <div className="features">
          <div className="feature-card">
            <h3>For Students</h3>
            <p>
              Post questions during class without disrupting. Get answers from
              professors or TAs.
            </p>
          </div>
          <div className="feature-card">
            <h3>For Professors</h3>
            <p>
              Teach with focus while questions are collected. Respond when
              convenient, ensuring clarity.
            </p>
          </div>
          <div className="feature-card">
            <h3>For TAs</h3>
            <p>
              Handle escalated or unanswered questions, ensuring no student query
              goes unnoticed.
            </p>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;