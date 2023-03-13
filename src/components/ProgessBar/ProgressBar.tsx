import React from "react";
import "./ProgressBar.scss";

const ProgressBar = () => {
  return (
    <div className="PBContainer">
      <div className="progressBar">
        <div className="progressFill"></div>
        <div className="progressText">0 of 4 steps completed</div>
      </div>
    </div>
  );
};

export default ProgressBar;
