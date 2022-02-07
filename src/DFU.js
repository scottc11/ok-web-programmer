class DFU {
    constructor(usbDevice) {
        this.selectedDevice = usbDevice;
    }

    async open() {
        await this.selectedDevice.open();
    }
}

export default DFU;