import React, { useState } from "react";
import dfu from "./dfu-util-js/dfu";
import "./App.scss";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";

function App() {
  const [areInstructionsDisplayed, setAreInstructionsDisplayed] =
    useState(false);

  const getDevices = () => {
    // navigator.usb.getDevices().then( (devices: USBDevice[]) =>{
    //   console.log(devices);
    // })

    navigator.usb.requestDevice({ filters: [] }).then((device: USBDevice) => {
      let interfaces = dfu.findDeviceDfuInterfaces(device);
    });
  };

  return (
    <div className="app">
      <Header />
      <Instructions
        areInstructionsDisplayed={areInstructionsDisplayed}
        setAreInstructionsDisplayed={setAreInstructionsDisplayed}
      />
      <div className="progressBar"></div>
      <div className="stepsContainer"></div>
      <div className="message"></div>
    </div>
  );
}

export default App;
