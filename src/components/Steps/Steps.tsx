import React from "react";
import "./Steps.scss";

const Steps = () => {
  return (
    <div className="stepsContainer">
      <div className="stepContainer">
        <div className="step">
          <div className="instructionTitle">Enter Bootloader Mode</div>
          <div className="bootloaderContainer">
            <input type="text" list="options" />
            <datalist id="options">
              <option>STM BOOTLOADER</option>
              <option>option two</option>
              <option>option three</option>
              <option>option four</option>
            </datalist>
          </div>
          <div className="instructionText">
            <sup>*</sup>Select STM BOOTLOADER from the list and then click
            'Connect' button".
          </div>
        </div>
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
