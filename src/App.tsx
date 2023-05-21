import React, { ChangeEvent, useEffect, useState } from "react";
import dfu from "./dfu-util-js/dfu";
import "./App.scss";
import Header from "./components/Header/Header";

function App() {

  const [device, setDevice] = useState<USBDevice>(null);
  const [file, setFile] = useState<any>(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceMFG, setDeviceMFG] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');

  const connect = () => {
    navigator.usb.requestDevice({ filters: [] }).then((device: USBDevice) => {
      let interfaces = dfu.findDeviceDfuInterfaces(device);
      setDevice(device);
      console.log(device);
      const settings = interfaces[0];
      console.log(settings);
      const interfaceNumber = settings.interface.interfaceNumber;
      console.log(interfaceNumber);

      if (device) {
        setDeviceName(device.productName);
        setDeviceMFG(device.manufacturerName);
        setDeviceSerial(device.serialNumber);
        device.open();
      }

    });
  };

  const disconnect = () => {
    if (device) {
      device.close();
      console.log(`Disconnected from ${device.productName}`)
    }
  }

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      
      console.log(event.target.files);
      
      const reader = new FileReader();
      
      reader.onload = () => {
        setFile(reader.result);
      };
      
      reader.readAsArrayBuffer(event.target.files[0]);
    }
  }

  const upload = () => {
    if (device && file) {
      console.log('upload');
    }
  }

  useEffect(() => {
    console.log(file);
  }, [file]);


  return (
    <div className="app">
      <Header />
      <div>
        <button onClick={() => connect()}>Connect</button>
        
        <button onClick={() => disconnect()}>Disconnect</button>
        
        <p>{deviceName}</p>
        <p>{deviceMFG}</p>
        <p>{deviceSerial}</p>
        <div>
          <input
            type="file"
            id="firmwareFile"
            name="file"
            disabled={false}
            onChange={(e)=> chooseFile(e)}
          />
        </div>
        <div>
          <button disabled={device && file ? false : true} onClick={() => upload()}>Upload</button>
        </div>
      </div>
    </div>
  );
}

export default App;
