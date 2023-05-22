import React, { ChangeEvent, useEffect, useState } from "react";
import DFU from "./dfu-util-js/dfu";
import "./App.scss";
import Header from "./components/Header/Header";

function App() {

  const [dfu] = useState<DFU>(new DFU());
  const [deviceStatus, setDeviceStatus] = useState('');
  const [file, setFile] = useState<any>(null);

  const connect = () => {
    navigator.usb.requestDevice({ filters: [] }).then(async (device: USBDevice) => {
      await dfu.connect(device);
      if (dfu.isOpened) {
        const status = await dfu.getStatus();
        setDeviceStatus('status.status');
      } else {
        setDeviceStatus('Failed to connect to device');
      }
    });
  };


  const disconnect = async () => {
    await dfu.disconnect();
    setDeviceStatus('disconnected');
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

  useEffect(() => {
    console.log(file);
  }, [file]);


  return (
    <div className="app">
      <Header />
      <div>
        <button onClick={() => connect()}>Connect</button>
        
        <button onClick={() => disconnect()}>Disconnect</button>
        
        <div>
          <p>
            {`Device Status: ${deviceStatus}`}
          </p>
        </div>

        { dfu.device && 
          <div>
            <p>{dfu.device.productName}</p>
            <p>{dfu.device.manufacturerName}</p>
            <p>{dfu.device.serialNumber}</p>
          </div>
        }

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
          <button disabled={dfu && file ? false : true} onClick={() => dfu.upload(file)}>Upload</button>
        </div>
      </div>
    </div>
  );
}

export default App;
