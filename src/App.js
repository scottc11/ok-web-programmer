import React, { Component } from 'react';
import DFU from './DFU';
import './App.css';
import { Button, Device } from './components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: null
    };

    this.selectDevice = this.selectDevice.bind(this)
  }

  selectDevice() {
    navigator.usb.requestDevice({ 'filters': [] }).then( device => {
      this.setState(
        {
          device: device
        }
      )
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          OK-Web-Programmer
        </header>
        <div className='App-body App-bg'>
          {this.state.device != null &&
            <Device usbDevice={this.state.device} />
          }
          <Button text="connect" action={this.selectDevice} />
        </div>
      </div>
    );
  }
}

export default App;