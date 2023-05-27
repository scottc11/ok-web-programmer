import React, { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { TbCircuitPushbutton } from "react-icons/tb";
import { GrConnect } from "react-icons/gr";

import DFU, { ProgressCallback } from "./dfu-util-js/dfu";
import "./App.scss";
import Header from "./components/Header/Header";

function App() {

  const [dfu] = useState<DFU>(new DFU());
  const [connected, setConnected] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('');
  const [file, setFile] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleProgress: ProgressCallback = (percentage, state) => {
    setProgress(percentage);
    setUploadStatus(state);
  }

  const connect = async () => {
    navigator.usb.requestDevice({ filters: [] }).then(async (device: USBDevice) => {
      await dfu.connect(device);
      dfu.setProgressCallback(handleProgress);
      if (dfu.isOpened()) {
        setConnected(true);
        const status = await dfu.getStatus();
        setDeviceStatus(`${status.status}`);
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
      const reader = new FileReader();
      
      reader.onload = () => {
        setFile(reader.result);
      };
      
      reader.readAsArrayBuffer(event.target.files[0]);
    }
  }

  useEffect(() => {

  }, [dfu])
  
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <div>
          <h1>
            Firmware Uploader
          </h1>
          <p>This web application is designed to update the firmware of OK200 Eurorack modules.</p>
          <p>Just follow the steps below, and everything should be ok 🙂.</p>
        </div>
        <div>
          <h2>STEP 1: Are you using Google Chrome v61 or greater? 👀</h2>
          <ul>
            <li>In order for this to work, you are going to need to <a target="_blank" href="https://www.google.com/intl/en_ca/chrome/?brand=CHBD&gclid=Cj0KCQjwyLGjBhDKARIsAFRNgW-0DbYRWHdafOcyVQptTB-Ko36qyNh3Whw0Bp7RcopmCFanZ26NPPsaAmq4EALw_wcB&gclsrc=aw.dshttps://www.google.com/search?q=Install+Google+Chrome&rlz=1C5CHFA_enCA969CA969&oq=Install+Google+Chrome&aqs=chrome..69i57.562j0j7&sourceid=chrome&ie=UTF-8">Install Google Chrome</a>. It is the only way 🙏.</li>
          </ul>
        </div>

        <div>
          <h2>STEP 2: Obtain firmware file <AiOutlineDownload /></h2>
          <p>You need a copy of the firmware you wish to upload to your module. To do so:</p>
          <ul>
            <li>Navigate to the <a target="_blank" href="https://github.com/scottc11/ok-web-programmer/blob/master/src/firmware">GitHub repository</a> which holds all the available firmware files.</li>
            <li>Select the firmware file you wish to upload. It will have a <b>'.bin'</b> extension.</li>
            <li>On the far right, there should be a <AiOutlineDownload /> icon. Press that, and <b>download the file to your local computer</b>.</li>
          </ul>
        </div>

        <div>
          <h2>STEP 3: Connect Module to your computer / Google Chrome and prepare for upload <GrConnect /></h2>
          <p>You now need to physically connect the module to your computer / laptop / tablet (? 🤷‍♂️). Follow these steps:</p>
          <ol>
            <li>Power OFF your Eurorack case.</li>
            <li>Bring your laptop over to your Eurorack case (or bring your Eurorack case close to your computer)</li>
            <li>Remove your module from the case, <b>but keep the power cable connected</b>.</li>
            <li>Using a standard USB cable, connect one end of the cable to the associated USB connector on underside of the module</li>
            <li>Connect the other end of the USB cable to your computer</li>
            <li>Power on your Eurorack case / power supply. The module needs to be powered for the firmware upload to work. Once powered, it should be operating as usual.</li>
            <li>Now, on the underside of the module, there is a <span className="accent">tiny black button</span> and a <span className="accent">tiny white button</span> (near where the Benders are mounted)</li>
            <ul>
              <li><TbCircuitPushbutton /> Press and hold down the BLACK button</li>
              <li>While the black button is being held down, <TbCircuitPushbutton /> press the WHITE button</li>
            </ul>
            <li>The module should now be "frozen" (ie. clock LED no longer flashing, touch pads unresponsive). This is GOOD! The module is now in "BOOTLOADER" mode.</li>
          </ol>
        </div>
        
        <div>
          <h2>STEP 4: Officially connect the module to the Google Chrome browser</h2>
          <p>Device Status: {dfu && connected ? 'connected' : 'disconnected'}</p>
          <ul>
            <li>Press this <button onClick={() => connect()}>Connect</button> button.</li>
            <li>A dropdown will appear. Select <span className="accent">"STM32 BOOTLOADER"</span> from that dropdown.</li>
          </ul>
        </div>

        {/* <button onClick={() => disconnect()}>Disconnect</button> */}
        
        <div>
          <h2>STEP 5: Upload firmware to the module</h2>
          <ul>
            <li>
              Remember that file you downloaded from GitHub earlier? Select that file 👇
            </li>
            <br></br>
            <input
              type="file"
              id="firmwareFile"
              name="file"
              disabled={false}
              onChange={(e) => chooseFile(e)}
            />
            <p></p>
            <li>Now press the Upload button</li>
            <br></br>
            <button disabled={dfu && file ? false : true} onClick={() => dfu.upload(file)}>Upload</button>
            { dfu && file &&
              <p>
                {uploadStatus}: %{progress.toFixed(2)}
              </p>
            }
          </ul>
        </div>
        <div>
          <h2>STEP 6: Finishing up</h2>
          <ul>
            <li>Once the upload process is complete, the module should automatically reset itself and start running the newly uploaded firmware</li>
            <li>Power off your Eurorack system / disconnect the power supply</li>
            <li>Gently remove the USB cable from the modules USB connector</li>
            <li>You can now mount the module back into your case and turn on the power.</li>
            <li>After the module powers up, you are going to want to <b>calibrate the BENDER components</b> (ALT + MODE)</li>
            <li>You are done!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
