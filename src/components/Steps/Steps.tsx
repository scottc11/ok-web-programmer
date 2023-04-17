import React from "react";
import "./Steps.scss";

const Steps = () => {
  return (
    <div className="stepsContainer">
      <div className="stepContainer">
        <div className="step1">
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
        <div className="step2">
          <button>connect</button>
        </div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
      <div className="stepContainer">
        <div className="step3">
          <div className="fileInputText">
            Here There will be helper text explaining which file they need to
            select, and if they don't have access to it, then further details as
            to how to obtain the firmware file. Here There will be helper text
            explaining which file they need to select, and if they don't have
            access to it, then further details as to how to obtain the firmware
            file
          </div>
          <div className="fileInputContainer">
            <input type="file" />
          </div>
        </div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
      <div className="stepContainer">
        <div className="step4">
          <button>Upload</button>
        </div>
        <div className="checkBtn">
          <span className="checkmark"></span>
        </div>
      </div>
    </div>
  );
};

export default Steps;
