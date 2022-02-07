import React from "react";
import './Device.css';

function Device(props) {
    return (
        <div className="device">
            <span className="device-name">{props.usbDevice.productName}</span>
            <span className="device-seperator"> :: </span>
            <span className="device-manufacturer-name">{props.usbDevice.manufacturerName}</span>
        </div>
    )
}

export default Device;