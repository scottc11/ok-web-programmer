export function hex4(n) {
    let s = n.toString(16)
    while (s.length < 4) {
        s = '0' + s;
    }
    return s;
}

export function hexAddr8(n) {
    let s = n.toString(16)
    while (s.length < 8) {
        s = '0' + s;
    }
    return "0x" + s;
}

export function niceSize(n) {
    const gigabyte = 1024 * 1024 * 1024;
    const megabyte = 1024 * 1024;
    const kilobyte = 1024;
    if (n >= gigabyte) {
        return n / gigabyte + "GiB";
    } else if (n >= megabyte) {
        return n / megabyte + "MiB";
    } else if (n >= kilobyte) {
        return n / kilobyte + "KiB";
    } else {
        return n + "B";
    }
}

export function formatDFUSummary(device) {
    const vid = hex4(device.device_.vendorId);
    const pid = hex4(device.device_.productId);
    const name = device.device_.productName;

    let mode = "Unknown"
    if (device.settings.alternate.interfaceProtocol == 0x01) {
        mode = "Runtime";
    } else if (device.settings.alternate.interfaceProtocol == 0x02) {
        mode = "DFU";
    }

    const cfg = device.settings.configuration.configurationValue;
    const intf = device.settings["interface"].interfaceNumber;
    const alt = device.settings.alternate.alternateSetting;
    const serial = device.device_.serialNumber;
    let info = `${mode}: [${vid}:${pid}] cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}" serial="${serial}"`;
    return info;
}

export function formatDFUInterfaceAlternate(settings) {
    let mode = "Unknown"
    if (settings.alternate.interfaceProtocol == 0x01) {
        mode = "Runtime";
    } else if (settings.alternate.interfaceProtocol == 0x02) {
        mode = "DFU";
    }

    const cfg = settings.configuration.configurationValue;
    const intf = settings["interface"].interfaceNumber;
    const alt = settings.alternate.alternateSetting;
    const name = (settings.name) ? settings.name : "UNKNOWN";

    return `${mode}: cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}"`;
}

export async function fixInterfaceNames(device_, interfaces) {
    // Check if any interface names were not read correctly
    if (interfaces.some(intf => (intf.name == null))) {
        // Manually retrieve the interface name string descriptors
        let tempDevice = new dfu.Device(device_, interfaces[0]);
        await tempDevice.device_.open();
        await tempDevice.device_.selectConfiguration(1);
        let mapping = await tempDevice.readInterfaceNames();
        await tempDevice.close();

        for (let intf of interfaces) {
            if (intf.name === null) {
                let configIndex = intf.configuration.configurationValue;
                let intfNumber = intf["interface"].interfaceNumber;
                let alt = intf.alternate.alternateSetting;
                intf.name = mapping[configIndex][intfNumber][alt];
            }
        }
    }
}