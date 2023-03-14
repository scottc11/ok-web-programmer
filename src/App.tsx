import React, { useState } from "react";
import dfu from "./dfu-util-js/dfu";
import "./App.scss";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import ProgressBar from "./components/ProgessBar/ProgressBar";
import Steps from "./components/Steps/Steps";
import Message from "./components/Message/Message";

function App() {
  const [areInstructionsDisplayed, setAreInstructionsDisplayed] =
    useState(false);

  const [isComplete, setIsComplete] = useState(true);

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
      <ProgressBar />
      <Steps />

      {isComplete ? <Message /> : ""}
    </div>
  );
}

export default App;
