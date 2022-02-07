import './App.css';
import { Button } from './components';

function requestDevices() {
  navigator.usb.requestDevice({ 'filters': [] }).then(
    selectedDevice => {
      console.log(selectedDevice);
    }
  )
}

function App() {

  navigator.usb.getDevices().then(devices => {
    console.log(`Number of Devices: ${devices.length}`);
    devices.forEach(device => {
      console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
    });
  })
  return (
    <div className="App">
      <header className="App-header">
        OK-Web-Programmer
      </header>
      <div className='App-body App-bg'>
        <Button text="connect" action={requestDevices} />
      </div>
    </div>
  );
}

export default App;
