import React from "react";
import dfu from "./dfu-util-js/dfu";
import "./App.scss";

function App() {
  const getDevices = () => {
    // navigator.usb.getDevices().then( (devices: USBDevice[]) =>{
    //   console.log(devices);
    // })

    navigator.usb.requestDevice({ filters: [] }).then((device: USBDevice) => {
      let interfaces = dfu.findDeviceDfuInterfaces(device);
    });
  };

  return <div className="app"></div>;
}

export default App;
