import React from "react";
import dfu from "./dfu-util-js/dfu";
import "./App.scss";
import logo from "./media/ok200logo.jpeg";

function App() {
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
      <div className="header"></div>
      <div className="gS"></div>
      <div className="progressBar"></div>
      <div className="stepsContainer"></div>
      <div className="message"></div>
    </div>
  );
}

export default App;
