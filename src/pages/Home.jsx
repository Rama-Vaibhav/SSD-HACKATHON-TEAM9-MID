import React from "react";
import StudentPage from "../components/StudentPage";
import MentorPage from "../components/MentorPage";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="box">
        <StudentPage />
      </div>
      <div className="box">
        <MentorPage />
      </div>
    </div>
  );
};

export default Home;
