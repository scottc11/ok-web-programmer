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

export function parseMemoryDescriptor(desc) {
    const nameEndIndex = desc.indexOf("/");
    if (!desc.startsWith("@") || nameEndIndex == -1) {
        throw `Not a DfuSe memory descriptor: "${desc}"`;
    }

    const name = desc.substring(1, nameEndIndex).trim();
    const segmentString = desc.substring(nameEndIndex);

    let segments = [];

    const sectorMultipliers = {
        ' ': 1,
        'B': 1,
        'K': 1024,
        'M': 1048576
    };

    let contiguousSegmentRegex = /\/\s*(0x[0-9a-fA-F]{1,8})\s*\/(\s*[0-9]+\s*\*\s*[0-9]+\s?[ BKM]\s*[abcdefg]\s*,?\s*)+/g;
    let contiguousSegmentMatch;
    while (contiguousSegmentMatch = contiguousSegmentRegex.exec(segmentString)) {
        let segmentRegex = /([0-9]+)\s*\*\s*([0-9]+)\s?([ BKM])\s*([abcdefg])\s*,?\s*/g;
        let startAddress = parseInt(contiguousSegmentMatch[1], 16);
        let segmentMatch;
        while (segmentMatch = segmentRegex.exec(contiguousSegmentMatch[0])) {
            let segment = {}
            let sectorCount = parseInt(segmentMatch[1], 10);
            let sectorSize = parseInt(segmentMatch[2]) * sectorMultipliers[segmentMatch[3]];
            let properties = segmentMatch[4].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
            segment.start = startAddress;
            segment.sectorSize = sectorSize;
            segment.end = startAddress + sectorSize * sectorCount;
            segment.readable = (properties & 0x1) != 0;
            segment.erasable = (properties & 0x2) != 0;
            segment.writable = (properties & 0x4) != 0;
            segments.push(segment);

            startAddress += sectorSize * sectorCount;
        }
    }

    return { "name": name, "segments": segments };
};