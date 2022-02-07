import React, { useState } from 'react';
import './App.css';
import { Button, Device } from './components';

function App() {

  const [device, setDevice] = useState(null);

  const selectDevice = async () => {
    setDevice(await navigator.usb.requestDevice({ 'filters': [] }))
  }

  return (
    <div className="App">
      <header className="App-header">
        OK-Web-Programmer
      </header>
      <div className='App-body App-bg'>
        {device != null &&
          <Device usbDevice={device} />
        }
        <Button text="connect" action={selectDevice} />
      </div>
    </div>
  );
}

export default App;


// navigator.usb.getDevices().then(devices => {
//   console.log(`Number of Devices: ${devices.length}`);
//   devices.forEach(device => {
//     console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
//   });
// })