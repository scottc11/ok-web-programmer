import { parseMemoryDescriptor } from "./dfu-util";

function calculatePercentage(current: number, total: number) {
    return (current / total) * 100;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export type ProgressCallback = (percentage: number, state: string) => void;

type DFUStatus = {
    status: number,
    pollTimeout: number,
    state: number
};

enum DfuseCommand {
    GET_COMMANDS = 0x00,
    SET_ADDRESS = 0x21,
    ERASE_SECTOR = 0x41
};

class DFU {
    device: USBDevice;
    
    progressCallback: ProgressCallback;

    configuration: number;
    interface: number;
    alternateInterface: number;

    transferSize: number;
    memoryInfo: any;

    DETACH: number;
    DNLOAD: number;
    UPLOAD: number;
    GETSTATUS: number;
    CLRSTATUS: number;
    GETSTATE: number;
    ABORT: number;

    appIDLE: number;
    appDETACH: number;
    dfuIDLE: number;
    dfuDNLOAD_SYNC: number;
    dfuDNBUSY: number;
    dfuDNLOAD_IDLE: number;
    dfuMANIFEST_SYNC: number;
    dfuMANIFEST: number;
    dfuMANIFEST_WAIT_RESET: number;
    dfuUPLOAD_IDLE: number;
    dfuERROR: number;
    STATUS_OK: number = 0x0;

    // defuse stuff
    GET_COMMANDS: number;
    SET_ADDRESS: number;
    ERASE_SECTOR: number;


    constructor() {
        this.transferSize = 2048; // default transfer size

        this.DETACH = 0x00;
        this.DNLOAD = 0x01;
        this.UPLOAD = 0x02;
        this.GETSTATUS = 0x03;
        this.CLRSTATUS = 0x04;
        this.GETSTATE = 0x05;
        this.ABORT = 6;

        this.appIDLE = 0;
        this.appDETACH = 1;

        this.dfuIDLE = 2;                // Indicates that the DFU process is in an idle state.
        this.dfuDNLOAD_SYNC = 3;         //  Indicates synchronization between the host and the device for the download process.
        this.dfuDNBUSY = 4;              // Indicates that the device is busy with the download process.
        this.dfuDNLOAD_IDLE = 5;         // Indicates that the device is ready to receive a new firmware image for download.
        this.dfuMANIFEST_SYNC = 6;       // Indicates synchronization between the host and the device for the manifest phase.
        this.dfuMANIFEST = 7;            // Indicates that the device is processing the manifest phase.
        this.dfuMANIFEST_WAIT_RESET = 8; // Indicates that the device is waiting for a reset after the manifest phase.
        this.dfuUPLOAD_IDLE = 9;         // Indicates that the device is ready to upload data.
        this.dfuERROR = 10;              // Indicates an error occurred during the DFU process.

        this.STATUS_OK = 0x0;

        this.GET_COMMANDS = 0x00;
        this.SET_ADDRESS = 0x21;
        this.ERASE_SECTOR = 0x41;
    }

    setProgressCallback(callback: ProgressCallback) {
        this.progressCallback = callback;
    }

    async connect(_device: USBDevice) {
        this.device = _device;
        let interfaces = this.findDeviceDfuInterfaces();
        console.log(this.device);
        console.log(this.device.productName);
        console.log(this.device.manufacturerName);
        console.log(this.device.serialNumber);
        const settings = interfaces[0];
        console.log(settings);

        this.configuration = settings.configuration.configurationValue;
        this.interface = settings.interface.interfaceNumber;
        this.alternateInterface = settings.alternate.alternateSetting;
        

        if (this.device) {
            try {
                await this.device.open();
                console.log('Device opened');
            } catch (error) {
                console.log(error);
            }

            try {
                await this.device.selectConfiguration(this.configuration);
                this.memoryInfo = parseMemoryDescriptor("@Internal Flash  /0x08000000/04*016Kg,01*064Kg,03*128Kg");
                console.log(`Selected configuration ${this.configuration}`);
            } catch (error) {
                console.log(error);
            }

            try {
                await this.device.claimInterface(this.interface);
                console.log(`Claimed interface ${this.interface}`);
            } catch (error) {
                console.log(error);
            }

            try {
                await this.device.selectAlternateInterface(this.interface, this.alternateInterface);
                console.log(`Selected alt interface ${this.alternateInterface}`);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async disconnect() {
        if (this.device) {
            await this.device.close();
            if (!this.device.opened) {
                console.log(`Disconnected from ${this.device.productName}`)
                this.device = null;
            }
        }
    }

    async read(bRequest: number, wLength: number, wValue = 0): Promise<USBInTransferResult> {
        try {
            const res = await this.device.controlTransferIn({
                "requestType": "class",
                "recipient": "interface",
                "request": bRequest,
                "value": wValue,
                "index": this.interface
            }, wLength);
            if (res.status == "ok") {
                return Promise.resolve(res);
            } else {
                return Promise.reject(res);
            }
        } catch (error) {
            return Promise.reject("ControlTransferIn failed: " + error);
        }
    }

    async write(bRequest: number, data: BufferSource, wValue = 0): Promise<USBOutTransferResult> {
        try {
            const res = await this.device.controlTransferOut({
                "requestType": "class",
                "recipient": "interface",
                "request": bRequest,
                "value": wValue,
                "index": this.interface
            }, data);
            if (res.status == "ok") {
                return Promise.resolve(res);
            } else {
                return Promise.reject(res);
            }
        } catch (error) {
            return Promise.reject("ControlTransferOut failed: " + error);
        }
    }

    findDeviceDfuInterfaces() {
        let interfaces = [];
        for (let conf of this.device.configurations) {
            for (let intf of conf.interfaces) {
                for (let alt of intf.alternates) {
                    if (alt.interfaceClass == 0xFE &&
                        alt.interfaceSubclass == 0x01 &&
                        (alt.interfaceProtocol == 0x01 || alt.interfaceProtocol == 0x02)) {
                        let settings = {
                            "configuration": conf,
                            "interface": intf,
                            "alternate": alt,
                            "name": alt.interfaceName
                        };
                        interfaces.push(settings);
                    }
                }
            }
        }

        return interfaces;
    }

    async getStatus(): Promise<DFUStatus> {
        const res = await this.read(this.GETSTATUS, 6);
        const status = {
            status: res.data.getUint8(0),
            pollTimeout: res.data.getUint32(1, true) & 0xFFFFFF,
            state: res.data.getUint8(4)
        }
        return status;
    }

    async clearStatus() {
        const tempBufferSource = new ArrayBuffer(0);
        return this.write(this.CLRSTATUS, tempBufferSource, 0);
    };

    isOpened() {
        return this.device.opened;
    }

    /**
     * 
     * @param data the firmware file to upload to device
     */
    async upload(data: ArrayBuffer) {

        const status = await this.getStatus();
        if (status.status == this.dfuERROR) {
            await this.clearStatus(); // clearing device status just seems to fix things 🤷‍♂️
        }

        const startAddress = 0x08000000;

        console.log(`Erasing sector 0x${startAddress.toString(16)}...`)
        await this.erase(startAddress, data.byteLength) // TODO: port functions which obtain this number from the device itself
        console.log(`Sector 0x${startAddress.toString(16)} erased. `)

        let bytes_sent = 0;
        let expected_size = data.byteLength;
        let transaction = 0;
        let address = startAddress;
        
        console.log(`⬆️⬆️⬆️ Uploading ${data.byteLength} bytes into sector 0x${startAddress.toString(16)}...`)
        while (bytes_sent < expected_size) {
            const bytes_left = expected_size - bytes_sent;
            const chunk_size = Math.min(bytes_left, this.transferSize);
            
            let status;
            let result: USBOutTransferResult;

            try {
                await this.dfuseCommand(this.SET_ADDRESS, address, 4);
                console.log(`Set address to 0x${address.toString(16)}`);

                const chunk = data.slice(bytes_sent, bytes_sent + chunk_size);
                result = await this.write(this.DNLOAD, chunk, 2);
                console.log(`Sent ${result.bytesWritten} bytes`);
                this.progressCallback(calculatePercentage(bytes_sent, expected_size), 'Uploading');
                status = await this.waitTillDevice((state: any) => state == this.dfuDNLOAD_IDLE);
                
                address += chunk_size;
            } catch (error) {
                console.log(error);
                throw "Error during DFU download: " + error;
            }

            if (status.status != this.STATUS_OK) {
                throw `DFU DOWNLOAD failed state=${status.state}, status=${status.status}`;
            }

            bytes_sent += result.bytesWritten;
            console.log(`${bytes_sent} of ${expected_size} written`);
        }
        console.log('\nFirmware upload complete. 🙌 \n');
        this.progressCallback(100, 'Done');
        console.log("Resetting device...");
        try {
            await this.dfuseCommand(this.SET_ADDRESS, startAddress, 4);
            await this.write(this.DNLOAD, new ArrayBuffer(0), 0);
        } catch (error) {
            throw "Error during DfuSe manifestation: " + error;
        }

        try {
            await this.waitTillDevice((state: any) => (state == this.dfuMANIFEST));
            console.log('\nFirmware upload complete. 🙌 \n');
        } catch (error) {
            console.log(error);
        }
    }

    async erase(startAddr: number, length: number) {
        let segment = this.getSegment(startAddr);
        let addr = this.getSectorStart(startAddr, segment);
        const endAddr = this.getSectorEnd(startAddr + length - 1);

        let bytesErased = 0;
        const bytesToErase = endAddr - addr;
        if (bytesToErase > 0) {
            console.log(`erased ${bytesErased} of ${bytesToErase} bytes`);
        }

        while (addr < endAddr) {
            if (segment.end <= addr) {
                segment = this.getSegment(addr);
            }
            if (!segment.erasable) {
                // Skip over the non-erasable section
                bytesErased = Math.min(bytesErased + segment.end - addr, bytesToErase);
                addr = segment.end;
                console.log(`Erased ${bytesErased} of ${bytesToErase} bytes`);
                continue;
            }
            const sectorIndex = Math.floor((addr - segment.start) / segment.sectorSize);
            const sectorAddr = segment.start + sectorIndex * segment.sectorSize;
            console.log(`Erasing ${segment.sectorSize}B at 0x${sectorAddr.toString(16)}`);
            await this.dfuseCommand(this.ERASE_SECTOR, sectorAddr, 4);
            addr = sectorAddr + segment.sectorSize;
            bytesErased += segment.sectorSize;
            console.log(`Erased ${bytesErased} of ${bytesToErase} bytes`);
            this.progressCallback(calculatePercentage(bytesErased, bytesToErase), 'Erasing');
        }
        this.progressCallback(100, 'Erasing finised');
    };

    async dfuseCommand(command: DfuseCommand, param: number = undefined, len: number = undefined) {
        if (typeof param === 'undefined' && typeof len === 'undefined') {
            param = 0x00;
            len = 1;
        }

        const commandNames = {
            0x00: "GET_COMMANDS",
            0x21: "SET_ADDRESS",
            0x41: "ERASE_SECTOR"
        };

        let payload = new ArrayBuffer(len + 1);
        let view = new DataView(payload);
        view.setUint8(0, command);
        if (len == 1) {
            view.setUint8(1, param);
        } else if (len == 4) {
            view.setUint32(1, param, true);
        } else {
            throw "Don't know how to handle data of len " + len;
        }

        try {
            await this.write(this.DNLOAD, payload, 0); // this line used the 'download' method
        } catch (error) {
            console.log(error);
            throw "Error during special DfuSe command " + commandNames[command] + ":" + error;
        }

        let status = await this.waitTillDevice((state: any) => (state != this.dfuDNBUSY));
        if (status.status != this.STATUS_OK) {
            throw "Special DfuSe command " + command + " failed";
        }
    };

    getSegment(addr: number) {
        if (!this.memoryInfo || !this.memoryInfo.segments) {
            throw "No memory map information available";
        }

        for (let segment of this.memoryInfo.segments) {
            if (segment.start <= addr && addr < segment.end) {
                return segment;
            }
        }

        return null;
    };

    getSectorStart(addr: number, segment: any) {
        if (typeof segment === 'undefined') {
            segment = this.getSegment(addr);
        }

        if (!segment) {
            throw `Address ${addr.toString(16)} outside of memory map`;
        }

        const sectorIndex = Math.floor((addr - segment.start) / segment.sectorSize);
        return segment.start + sectorIndex * segment.sectorSize;
    };


    getSectorEnd(addr: number, segment: any = undefined) {
        if (typeof segment === 'undefined') {
            segment = this.getSegment(addr);
        }

        if (!segment) {
            throw `Address ${addr.toString(16)} outside of memory map`;
        }

        const sectorIndex = Math.floor((addr - segment.start) / segment.sectorSize);
        return segment.start + (sectorIndex + 1) * segment.sectorSize;
    };

    async waitTillDevice(compareFn: Function): Promise<DFUStatus> {
        
        let dfu_status = await this.getStatus();

        let device = this;
        function async_sleep(duration_ms: number) {
            return new Promise(function (resolve, reject) {
                console.log("Sleeping for " + duration_ms + "ms");
                setTimeout(resolve, duration_ms);
            });
        }

        while (!compareFn(dfu_status.state) && dfu_status.state != this.dfuERROR) {
            await async_sleep(dfu_status.pollTimeout);
            dfu_status = await this.getStatus();
        }

        return dfu_status;
    }

}

export default DFU;