import React from "react";
import Header from "./components/Header/Header";
import dfu from './dfu-util-js/dfu';

function App() {

  const getDevices = () => {
    // navigator.usb.getDevices().then( (devices: USBDevice[]) =>{
    //   console.log(devices);
    // })

    navigator.usb.requestDevice({filters: []}).then( (device: USBDevice) => {
      let interfaces = dfu.findDeviceDfuInterfaces(device);
    });

  }

  return (
    <div className="app">
      <Header />
      <button onClick={() => getDevices()}>connect</button>
      <input type="file" disabled={false} />
    </div>
  );
}

export default App;
