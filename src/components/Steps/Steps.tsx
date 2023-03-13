import React from "react";
import "./Steps.scss";

const Steps = () => {
  return (
    <div className="stepsContainer">
      <div className="stepContainer">
        <div className="step"></div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
      <div className="stepContainer">
        <div className="step"></div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
      <div className="stepContainer">
        <div className="step"></div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
      <div className="stepContainer">
        <div className="step"></div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
    </div>
  );
};

export default Steps;
