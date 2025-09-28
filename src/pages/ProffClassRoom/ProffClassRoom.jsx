import React from "react";
import { useParams } from "react-router-dom";
import Questions from "../../component/Questions/Questions";
import './proffRoom.css'
const ProfessorClassRoom = () => {
  const { classCode } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Professor View - Class: {classCode}</h1>
      <Questions classCode={classCode} />
    </div>
  );
};

export default ProfessorClassRoom;
